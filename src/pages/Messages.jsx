import React, { useState, useEffect } from "react";
import LoggedInNavbar from "../components/nav/LoggedInNavbar";
import Footer from "../components/Footer";
import {
  BACKGROUND_COLOR,
  FEATURE_BG,
  BORDER_COLOR,
  ACCENT_GRADIENT,
  GridOverlay,
} from "../utils/constants";
import { initSocket, getSocket } from "../socket";

const API_BASE = "http://localhost:8000";

export default function Messages() {
  const [threads, setThreads] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messagesByThread, setMessagesByThread] = useState({});
  const [draft, setDraft] = useState("");

  // Modals
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newMember, setNewMember] = useState("");

  const [currentUserId, setCurrentUserId] = useState(null);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState("");

  const activeThread = threads.find((t) => t.id === activeId);
  const messages = activeId ? messagesByThread[activeId] || [] : [];

  // 1) Fetch current user + init socket
  useEffect(() => {
    initSocket();

    async function fetchMe() {
      try {
        const res = await fetch(`${API_BASE}/api/auth/me`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) {
          setCurrentUserId(data.data?._id || data.user?._id);
        }
      } catch (e) {
        console.warn("auth/me error:", e);
      }
    }

    fetchMe();
  }, []);

  // 2) Fetch conversations (with populated members)
  useEffect(() => {
    async function fetchConversations() {
      setLoadingConvs(true);
      setError("");
      try {
        const res = await fetch(`${API_BASE}/api/conversations`, {
          credentials: "include",
        });
        const data = await res.json();

        if (!data.success) {
          setError(data.error || "Failed to load conversations.");
          return;
        }

        const convs = data.data || [];
        const mapped = convs.map((c) => ({
          id: c._id,
          name: c.name || "Conversation",
          last: "",
          unread: 0,
          members: (c.members || []).map((m) => ({
            id: m._id || m,
            name: m.fullname || m.name || m.email || "Unknown",
            email: m.email || null,
          })),
        }));

        setThreads(mapped);
        if (mapped.length > 0) setActiveId(mapped[0].id);
      } catch (e) {
        console.error("Conversations error:", e);
        setError("Failed to load conversations.");
      } finally {
        setLoadingConvs(false);
      }
    }

    fetchConversations();
  }, []);

  // 3) Fetch messages when active conversation changes
  useEffect(() => {
    if (!activeId) return;

    async function fetchMessages() {
      setLoadingMessages(true);
      setError("");

      try {
        const res = await fetch(
          `${API_BASE}/api/conversations/${activeId}/messages`,
          { credentials: "include" }
        );
        const data = await res.json();

        if (!data.success) {
          setError(data.error || "Failed to load messages.");
          return;
        }

        const msgs = data.data || [];
        const mapped = msgs.map((m) => ({
          id: m._id,
          text: m.text,
          fromSelf:
            currentUserId &&
            String(m.sender) === String(currentUserId),
        }));

        setMessagesByThread((prev) => ({
          ...prev,
          [activeId]: mapped,
        }));
      } catch (e) {
        console.error("Messages error:", e);
        setError("Failed to load messages.");
      } finally {
        setLoadingMessages(false);
      }
    }

    fetchMessages();

    const socket = getSocket();
    if (socket) {
      socket.emit("conversation:join", { conversationId: activeId });
    }
  }, [activeId, currentUserId]);

  // 4) Listen for live incoming messages (with de-dupe on tempId)
  useEffect(() => {
    const socket = initSocket();

    const handler = (msg) => {
      const convId = msg.conversation;

      setMessagesByThread((prev) => {
        const existing = prev[convId] || [];
        const fromSelf =
          currentUserId &&
          String(msg.sender) === String(currentUserId);

        // If this message has a tempId and it's from self,
        // try to find and replace the optimistic message instead of adding a duplicate.
        if (msg.tempId && fromSelf) {
          const idx = existing.findIndex(
            (m) => m.tempId && m.tempId === msg.tempId
          );
          if (idx !== -1) {
            const updated = [...existing];
            updated[idx] = {
              id: msg._id,
              text: msg.text,
              fromSelf,
              tempId: msg.tempId,
            };
            return {
              ...prev,
              [convId]: updated,
            };
          }
        }

        // Otherwise just append as a new message
        const mapped = {
          id: msg._id,
          text: msg.text,
          fromSelf,
        };

        return {
          ...prev,
          [convId]: [...existing, mapped],
        };
      });

      setThreads((prev) =>
        prev.map((t) =>
          t.id === convId
            ? {
                ...t,
                last: msg.text,
                unread: t.id === activeId ? 0 : (t.unread || 0) + 1,
              }
            : t
        )
      );
    };

    socket.on("message:new", handler);
    return () => socket.off("message:new", handler);
  }, [activeId, currentUserId]);

  // 5) Send a message (optimistic with tempId)
  const send = (e) => {
    e.preventDefault();
    if (!draft.trim() || !activeId) return;

    const socket = getSocket();
    if (!socket) return;

    const text = draft.trim();
    const tempId = `temp-${Date.now()}`;

    const optimistic = {
      id: tempId,
      tempId,        // ⬅️ keep track so we can match it later
      text,
      fromSelf: true,
    };

    setMessagesByThread((prev) => ({
      ...prev,
      [activeId]: [...(prev[activeId] || []), optimistic],
    }));

    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeId ? { ...t, last: text, unread: 0 } : t
      )
    );

    socket.emit(
      "message:send",
      { conversationId: activeId, text, tempId, attachments: [] },
      (ack) => {
        if (!ack?.ok) console.error("Send failed:", ack?.error);
      }
    );

    setDraft("");
  };

  // New conversation modal
  const openNewModal = () => {
    setNewName("");
    setIsNewOpen(true);
  };

  const createNewConversation = async (e) => {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;

    try {
      const res = await fetch(`${API_BASE}/api/dev/seed-conv`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (!data.success) {
        console.error("seed-conv error:", data);
        return;
      }

      const conv = data.data;

      setThreads((prev) => [
        {
          id: conv._id,
          name: conv.name || name,
          last: "",
          unread: 0,
          members: (conv.members || []).map((m) => ({
            id: m._id || m,
            name: m.fullname || m.name || m.email || "Unknown",
            email: m.email || null,
          })),
        },
        ...prev,
      ]);

      setMessagesByThread((prev) => ({
        ...prev,
        [conv._id]: [],
      }));

      setActiveId(conv._id);
      setIsNewOpen(false);
    } catch (err) {
      console.error("createNewConversation error:", err);
    }
  };

  // Add member modal
  const openAddMemberModal = () => {
    if (!activeThread) return;
    setNewMember("");
    setIsAddOpen(true);
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    const email = newMember.trim();
    if (!email || !activeThread) return;

    try {
      const res = await fetch(
        `${API_BASE}/api/conversations/${activeThread.id}/add-member`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();
      if (!data.success) {
        console.error("add-member error:", data);
        return;
      }

      const conv = data.data;

      setThreads((prev) =>
        prev.map((t) =>
          t.id === activeThread.id
            ? {
                ...t,
                members: (conv.members || []).map((m) => ({
                  id: m._id || m,
                  name: m.fullname || m.name || m.email || "Unknown",
                  email: m.email || null,
                })),
              }
            : t
        )
      );

      setIsAddOpen(false);
    } catch (err) {
      console.error("handleAddMember error:", err);
    }
  };

  return (
    <div
      className={`min-h-screen ${BACKGROUND_COLOR} text-white relative overflow-hidden font-quicksand`}
    >
      <GridOverlay />
      <LoggedInNavbar />

      {/* Header */}
      <section className="relative mb-10 text-center">
        <div
          className={`absolute inset-0 pointer-events-none opacity-20 ${ACCENT_GRADIENT}`}
        />
        <div className="relative max-w-7xl mx-auto px-6 pt-10 pb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-audiowide mb-1">
            Messages
          </h1>
          <p className="text-gray-300">Chat with your squad and peers.</p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 pb-12 relative z-10">
        <div className="grid grid-cols-12 gap-6">
          {/* Conversations list */}
          <aside
            className={`col-span-12 md:col-span-4 lg:col-span-3 rounded-2xl ${FEATURE_BG} ${BORDER_COLOR} border p-4`}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Conversations</h2>
              <button
                onClick={openNewModal}
                className={`px-3 py-1 rounded-lg text-sm font-semibold shadow hover:brightness-110 ${ACCENT_GRADIENT}`}
              >
                New
              </button>
            </div>

            {error && (
              <p className="text-xs text-red-400 mb-2 text-center">
                {error}
              </p>
            )}

            {loadingConvs ? (
              <p className="text-sm text-gray-400">
                Loading conversations...
              </p>
            ) : threads.length === 0 ? (
              <p className="text-sm text-gray-400">
                No conversations yet. You may need to seed some via the
                backend.
              </p>
            ) : (
              <ul className="space-y-2">
                {threads.map((t) => {
                  const active = t.id === activeId;
                  return (
                    <li key={t.id}>
                      <button
                        onClick={() => setActiveId(t.id)}
                        className={`w-full text-left rounded-xl px-3 py-2 border transition ${
                          active
                            ? "border-cyan-400 bg-cyan-500/10"
                            : `${BORDER_COLOR} border hover:border-cyan-400/60`
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`font-medium ${
                              active ? "text-white" : "text-gray-200"
                            }`}
                          >
                            {t.name}
                          </span>
                          {t.unread > 0 && (
                            <span className="ml-2 inline-flex items-center justify-center min-w-5 h-5 px-1 rounded-full bg-fuchsia-600 text-[11px]">
                              {t.unread}
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-400 truncate">
                          {t.last || "Start a conversation"}
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </aside>

          {/* Chat pane */}
          <section
            className={`col-span-12 md:col-span-8 lg:col-span-9 rounded-2xl ${FEATURE_BG} ${BORDER_COLOR} border p-4 md:p-6`}
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-lg font-audiowide tracking-wider">
                  {activeThread?.name ?? "Select a conversation"}
                </h2>
                {activeThread?.members &&
                  activeThread.members.length > 0 && (
                    <p className="text-xs text-gray-400 mt-1">
                      Members:{" "}
                      {activeThread.members
                        .map((m) => m.name)
                        .join(", ")}
                    </p>
                  )}
              </div>
              <button
                onClick={openAddMemberModal}
                disabled={!activeThread}
                className={`px-3 py-1 rounded-lg text-sm font-semibold shadow hover:brightness-110 ${ACCENT_GRADIENT} ${
                  !activeThread ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                Add Member
              </button>
            </div>

            <div
              className={`h-[48vh] md:h-[58vh] rounded-xl overflow-y-auto p-3 space-y-3 ${BACKGROUND_COLOR} ${BORDER_COLOR} border`}
            >
              {loadingMessages && activeId && (
                <p className="text-sm text-gray-400 text-center mt-4">
                  Loading messages...
                </p>
              )}

              {!loadingMessages && messages.length === 0 && activeId && (
                <p className="text-sm text-gray-500 text-center mt-4">
                  No messages yet. Start the conversation below.
                </p>
              )}

              {!activeId && (
                <p className="text-sm text-gray-500 text-center mt-4">
                  Select a conversation to start chatting.
                </p>
              )}

              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${
                    m.fromSelf ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl px-3 py-2 text-sm border ${
                      m.fromSelf
                        ? "bg-blue-600 border-blue-500"
                        : `${FEATURE_BG} ${BORDER_COLOR} border`
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={send} className="mt-4 flex gap-2">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={
                  activeThread ? "Type a message…" : "Select a conversation…"
                }
                disabled={!activeThread}
                className={`flex-1 rounded-lg px-3 py-2 text-sm ${BACKGROUND_COLOR} ${BORDER_COLOR} border ${
                  !activeThread ? "opacity-60 cursor-not-allowed" : ""
                }`}
              />
              <button
                type="submit"
                disabled={!activeThread || !draft.trim()}
                className={`px-4 py-2 rounded-lg text-sm font-semibold shadow hover:brightness-110 ${ACCENT_GRADIENT} ${
                  !activeThread || !draft.trim()
                    ? "opacity-60 cursor-not-allowed"
                    : ""
                }`}
              >
                Send
              </button>
            </form>
          </section>
        </div>

        <Footer />
      </main>

      {/* New Conversation Modal */}
      {isNewOpen && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/60">
          <div
            className={`w-full max-w-md rounded-2xl p-6 ${FEATURE_BG} ${BORDER_COLOR} border`}
          >
            <h3 className="text-lg font-semibold mb-3">Start a New Chat</h3>
            <form onSubmit={createNewConversation} className="space-y-4">
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Conversation Name (e.g., Squad Chat)"
                className={`w-full rounded-lg px-3 py-2 text-sm ${BACKGROUND_COLOR} ${BORDER_COLOR} border`}
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewOpen(false)}
                  className={`px-3 py-1 rounded-lg text-sm font-semibold ${BORDER_COLOR} border`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-3 py-1 rounded-lg text-sm font-semibold shadow hover:brightness-110 ${ACCENT_GRADIENT}`}
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {isAddOpen && activeThread && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/60">
          <div
            className={`w-full max-w-md rounded-2xl p-6 ${FEATURE_BG} ${BORDER_COLOR} border`}
          >
            <h3 className="text-lg font-semibold mb-3">
              Add Member to {activeThread.name}
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Enter the <span className="font-medium">email</span> of the member
              you want to add. If they don&apos;t have an account yet, one will
              be created and they can log in later.
            </p>
            <form onSubmit={handleAddMember} className="space-y-4">
              <input
                value={newMember}
                onChange={(e) => setNewMember(e.target.value)}
                placeholder="member@example.com"
                className={`w-full rounded-lg px-3 py-2 text-sm ${BACKGROUND_COLOR} ${BORDER_COLOR} border`}
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className={`px-3 py-1 rounded-lg text-sm font-semibold ${BORDER_COLOR} border`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-3 py-1 rounded-lg text-sm font-semibold shadow hover:brightness-110 ${ACCENT_GRADIENT}`}
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
