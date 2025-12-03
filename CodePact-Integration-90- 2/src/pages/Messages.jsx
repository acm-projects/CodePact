// src/pages/Messages.jsx
import React, { useEffect, useState, useRef } from "react";
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

const API_BASE = "http://localhost:3000";

export default function Messages() {
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);

  const [messagesByConv, setMessagesByConv] = useState({});
  const [messageInput, setMessageInput] = useState("");

  const [currentUserId, setCurrentUserId] = useState(null);

  const [loadingConvos, setLoadingConvos] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState("");

  // Modals
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");

  const bottomRef = useRef(null);

  const activeConv = conversations.find((c) => c.id === activeId) || null;
  const messages = activeId ? messagesByConv[activeId] || [] : [];

  // =====================================================
  // 1. LOAD CURRENT USER + INIT SOCKET
  // =====================================================
  useEffect(() => {
    async function fetchMe() {
      try {
        const res = await fetch(`${API_BASE}/api/auth/me`, {
          credentials: "include",
        });
        const data = await res.json();
        console.log("🟩 /api/auth/me:", data);

        const id =
          data.data?._id || data.user?._id || data?.user?.id || null;

        if (id) {
          setCurrentUserId(String(id));
        }
      } catch (err) {
        console.error("fetchMe error:", err);
      }
    }

    fetchMe();

    // initialize socket once
    if (!getSocket()) initSocket();
  }, []);

  // =====================================================
  // 2. LOAD CONVERSATIONS
  // =====================================================
  useEffect(() => {
    async function loadConvos() {
      setLoadingConvos(true);
      setError("");

      try {
        const res = await fetch(`${API_BASE}/api/conversations`, {
          credentials: "include",
        });
        const data = await res.json();
        console.log("🟦 /api/conversations:", data);

        if (!data.success) {
          setError(data.error || "Failed to load conversations.");
          setConversations([]);
          return;
        }

        const convs = (data.data || []).map((c) => ({
          id: c._id,
          name: c.name || "Conversation",
          members: c.members || [],
          last: "",
        }));

        setConversations(convs);

        if (convs.length > 0 && !activeId) {
          setActiveId(convs[0].id);
        }
      } catch (err) {
        console.error("loadConvos error:", err);
        setError("Failed to load conversations.");
      } finally {
        setLoadingConvos(false);
      }
    }

    loadConvos();
  }, []);

  // =====================================================
  // 3. LOAD MESSAGES WHEN ACTIVE CHAT CHANGES
  // =====================================================
  useEffect(() => {
    if (!activeId || !currentUserId) return;

    async function loadMessages() {
      setLoadingMessages(true);

      try {
        const res = await fetch(
          `${API_BASE}/api/conversations/${activeId}/messages`,
          { credentials: "include" }
        );
        const data = await res.json();
        console.log("🟧 /messages:", data);

        if (!data.success) return;

        const mapped = (data.data || []).map((m) => {
          const senderId = m.sender?._id || m.sender;
          return {
            id: m._id,
            text: m.text,
            sender: senderId,
            fromSelf: String(senderId) === String(currentUserId),
          };
        });

        setMessagesByConv((prev) => ({
          ...prev,
          [activeId]: mapped,
        }));

        setTimeout(() => {
          bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 50);
      } catch (err) {
        console.error("loadMessages error:", err);
      } finally {
        setLoadingMessages(false);
      }
    }

    loadMessages();

    const s = getSocket();
    s.emit("conversation:join", { conversationId: activeId });
  }, [activeId, currentUserId]);

  // =====================================================
  // 4. SOCKET LISTENER FOR REAL-TIME MESSAGES
  // =====================================================
  useEffect(() => {
    if (!currentUserId) return; // ⛔ wait until user is loaded

    const s = getSocket();
    if (!s) return;

    const handler = (msg) => {
      if (!msg) return;

      console.log("🟪 message:new:", msg);

      const convId = msg.conversation;
      const senderId = msg.sender;
      const fromSelf = String(senderId) === String(currentUserId);

      const mapped = {
        id: msg._id,
        text: msg.text,
        sender: senderId,
        fromSelf,
      };

      setMessagesByConv((prev) => {
        const existing = prev[convId] || [];

        // ⛔ prevent duplicates
        if (existing.some((m) => m.id === mapped.id)) return prev;

        return {
          ...prev,
          [convId]: [...existing, mapped],
        };
      });

      // update last message in sidebar
      setConversations((prev) =>
        prev.map((c) =>
          c.id === convId ? { ...c, last: msg.text } : c
        )
      );

      if (convId === activeId) {
        setTimeout(() => {
          bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 50);
      }
    };

    s.on("message:new", handler);

    return () => {
      s.off("message:new", handler);
    };
  }, [currentUserId, activeId]);

  // =====================================================
  // 5. SEND MESSAGE (ONLY EMIT — NO LOCAL DUPLICATE)
  // =====================================================
  const sendMessage = (e) => {
    e.preventDefault();

    const text = messageInput.trim();
    if (!text || !activeId) return;

    const s = getSocket();
    s.emit("message:send", {
      conversationId: activeId,
      text,
    });

    setMessageInput("");
  };

  // =====================================================
  // 6. CREATE NEW CHAT
  // =====================================================
  const openNewModal = () => {
    setNewName("");
    setIsNewOpen(true);
  };

  const createConversation = async (e) => {
    e.preventDefault();

    if (!newName.trim()) return;

    const res = await fetch(`${API_BASE}/api/dev/seed-conv`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name: newName.trim() }),
    });

    const data = await res.json();
    console.log("🟦 seed-conv response:", data);

    if (!data.success) {
      alert("Failed to create chat");
      return;
    }

    const conv = {
      id: data.data._id,
      name: data.data.name,
      members: data.data.members,
      last: "",
    };

    setConversations((prev) => [conv, ...prev]);
    setMessagesByConv((prev) => ({ ...prev, [conv.id]: [] }));
    setActiveId(conv.id);
    setIsNewOpen(false);
  };

  // =====================================================
  // 7. ADD MEMBER
  // =====================================================
  const openAddMemberModal = () => {
    if (!activeConv) return;
    setNewMemberEmail("");
    setIsAddOpen(true);
  };

  const addMember = async (e) => {
    e.preventDefault();
    const email = newMemberEmail.trim();
    if (!email || !activeConv) return;

    const res = await fetch(
      `${API_BASE}/api/conversations/${activeConv.id}/add-member`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email }),
      }
    );

    const data = await res.json();
    console.log("🟩 add-member response:", data);

    if (!data.success) {
      alert("Failed");
      return;
    }

    const updatedMembers = data.data.members || [];

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConv.id
          ? { ...c, members: updatedMembers }
          : c
      )
    );

    setIsAddOpen(false);
  };

  // label for members
  const membersLabel =
    activeConv && activeConv.members?.length
      ? activeConv.members
          .map(
            (m) =>
              m.fullname || m.name || m.email || "Unknown"
          )
          .join(", ")
      : "Unknown";

  // =====================================================
  // UI RENDER
  // =====================================================
  return (
    <div
      className={`min-h-screen ${BACKGROUND_COLOR} text-white relative overflow-hidden font-quicksand flex flex-col`}
    >
      <GridOverlay />
      <LoggedInNavbar />

      <section className="relative mb-6">
        <div className="relative max-w-7xl mx-auto px-6 pt-10 pb-4 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-audiowide">
            Messages
          </h1>
        </div>
      </section>

      <main className="max-w-7xl mx-auto w-full px-6 pb-10 flex-1 flex flex-col">
        {error && (
          <p className="text-center text-xs text-red-400 mb-2">{error}</p>
        )}

        <div className="flex flex-1 gap-6">
          {/* LEFT SIDEBAR */}
          <aside
            className={`w-64 ${FEATURE_BG} ${BORDER_COLOR} border rounded-2xl p-4 flex flex-col`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-sm">Chats</h2>
              <button
                onClick={openNewModal}
                className={`px-3 py-1 rounded-lg text-xs font-semibold ${ACCENT_GRADIENT} shadow`}
              >
                New
              </button>
            </div>

            {loadingConvos ? (
              <p className="text-xs text-gray-400">Loading…</p>
            ) : conversations.length === 0 ? (
              <p className="text-xs text-gray-400">No chats. Create one.</p>
            ) : (
              <div className="space-y-2 overflow-y-auto">
                {conversations.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveId(c.id)}
                    className={`w-full text-left rounded-xl px-3 py-2 border text-sm ${
                      activeId === c.id
                        ? "bg-cyan-500/20 border-cyan-400"
                        : `${BORDER_COLOR} border hover:border-cyan-400/60`
                    }`}
                  >
                    <div className="font-medium truncate">{c.name}</div>
                    <div className="text-[11px] text-gray-400">
                      {(c.members || []).length} members
                    </div>
                  </button>
                ))}
              </div>
            )}
          </aside>

          {/* MAIN CHAT PANEL */}
          <section
            className={`${FEATURE_BG} ${BORDER_COLOR} border rounded-2xl flex-1 flex flex-col p-4`}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-semibold">
                  {activeConv ? activeConv.name : "Select a chat"}
                </h2>
                {activeConv && (
                  <p className="text-[11px] text-gray-400 mt-1">
                    Members: {membersLabel}
                  </p>
                )}
              </div>

              <button
                type="button"
                disabled={!activeConv}
                onClick={openAddMemberModal}
                className={`px-3 py-1 rounded-lg text-xs font-semibold ${ACCENT_GRADIENT} shadow ${
                  !activeConv ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                Add Member
              </button>
            </div>

            {/* MESSAGE AREA */}
            <div
              className={`flex-1 rounded-xl ${BACKGROUND_COLOR} ${BORDER_COLOR} border px-3 py-3 overflow-y-auto space-y-3`}
            >
              {!activeConv ? (
                <p className="text-xs text-gray-400 text-center mt-4">
                  Select a chat.
                </p>
              ) : loadingMessages ? (
                <p className="text-xs text-gray-400 text-center mt-4">
                  Loading messages…
                </p>
              ) : messages.length === 0 ? (
                <p className="text-xs text-gray-400 text-center mt-4">
                  No messages yet.
                </p>
              ) : (
                messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${
                      m.fromSelf ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] px-3 py-1.5 rounded-lg text-xs border ${
                        m.fromSelf
                          ? "bg-blue-600 border-blue-500"
                          : `${FEATURE_BG} ${BORDER_COLOR}`
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))
              )}

              <div ref={bottomRef} />
            </div>

            {/* INPUT */}
            <form onSubmit={sendMessage} className="mt-3 flex items-center gap-3">
              <input
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                disabled={!activeConv}
                placeholder={
                  activeConv ? "Type a message…" : "Select a chat first"
                }
                className={`flex-1 rounded-lg px-3 py-2 text-xs ${BACKGROUND_COLOR} ${BORDER_COLOR} border ${
                  !activeConv ? "opacity-60" : ""
                }`}
              />
              <button
                type="submit"
                disabled={!activeConv || !messageInput.trim()}
                className={`px-4 py-2 rounded-lg text-xs font-semibold ${ACCENT_GRADIENT} shadow ${
                  !activeConv || !messageInput.trim()
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

      {/* NEW CHAT MODAL */}
      {isNewOpen && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/60">
          <div
            className={`w-full max-w-sm rounded-2xl p-6 ${FEATURE_BG} ${BORDER_COLOR} border`}
          >
            <h3 className="text-sm font-semibold mb-3">Start a New Chat</h3>
            <form onSubmit={createConversation} className="space-y-4">
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Conversation name"
                className={`w-full rounded-lg px-3 py-2 text-sm ${BACKGROUND_COLOR} ${BORDER_COLOR} border`}
              />
              <div className="flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setIsNewOpen(false)}
                  className={`${BORDER_COLOR} border rounded-lg px-3 py-1`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`${ACCENT_GRADIENT} rounded-lg px-3 py-1 font-semibold`}
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD MEMBER MODAL */}
      {isAddOpen && activeConv && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/60">
          <div
            className={`w-full max-w-sm rounded-2xl p-6 ${FEATURE_BG} ${BORDER_COLOR} border`}
          >
            <h3 className="text-sm font-semibold mb-2">
              Add Member to {activeConv.name}
            </h3>
            <form onSubmit={addMember} className="space-y-4">
              <input
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                placeholder="member@example.com"
                className={`w-full rounded-lg px-3 py-2 text-sm ${BACKGROUND_COLOR} ${BORDER_COLOR} border`}
              />
              <div className="flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className={`${BORDER_COLOR} border rounded-lg px-3 py-1`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`${ACCENT_GRADIENT} rounded-lg px-3 py-1 font-semibold`}
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
