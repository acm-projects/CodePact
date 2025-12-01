import React, { useState, useEffect } from "react";
import LoggedInNavbar from "../components/nav/LoggedInNavBar";
import Footer from "../components/Footer";
import {
  BACKGROUND_COLOR,
  FEATURE_BG,
  BORDER_COLOR,
  ACCENT_GRADIENT,
  GridOverlay,
} from "../utils/constants";

import { initSocket, getSocket } from "../socket";

const API = "http://localhost:3000";

export default function Messages() {
  const [conversations, setConversations] = useState([]);
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState({});
  const [draft, setDraft] = useState("");

  const [me, setMe] = useState(null);

  const [newModal, setNewModal] = useState(false);
  const [newName, setNewName] = useState("");

  const [addModal, setAddModal] = useState(false);
  const [addEmail, setAddEmail] = useState("");

  // -------------------- LOAD USER --------------------
  useEffect(() => {
    async function loadMe() {
      try {
        const res = await fetch(`${API}/api/auth/me`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) setMe(data.data);
      } catch (e) {
        console.log("auth/me error:", e);
      }
    }

    loadMe();
  }, []);

  // -------------------- LOAD CONVERSATIONS --------------------
  useEffect(() => {
    async function loadConvs() {
      try {
        const res = await fetch(`${API}/api/conversations`, {
          credentials: "include",
        });
        const data = await res.json();

        if (!data.success) return;

        const formatted = data.data.map((c) => ({
          id: c._id,
          name: c.name,
          members: c.members,
        }));

        setConversations(formatted);

        if (formatted.length > 0) setActive(formatted[0].id);
      } catch (e) {
        console.error("Conversation load error:", e);
      }
    }

    loadConvs();
  }, []);

  // -------------------- LOAD MESSAGES FOR ACTIVE --------------------
  useEffect(() => {
    if (!active) return;

    async function loadMsgs() {
      try {
        const res = await fetch(`${API}/api/conversations/${active}/messages`, {
          credentials: "include",
        });

        const data = await res.json();
        if (!data.success) return;

        setMessages((prev) => ({
          ...prev,
          [active]: data.data,
        }));

        let socket = getSocket();
        if (!socket) {
          initSocket();
          socket = getSocket();
        }

        socket.emit("conversation:join", { conversationId: active });
      } catch (e) {
        console.error("message load error:", e);
      }
    }

    loadMsgs();
  }, [active]);

  // -------------------- SOCKET HANDLER --------------------
  useEffect(() => {
    let socket = getSocket();
    if (!socket) {
      initSocket();
      socket = getSocket();
    }

    socket.on("message:new", (msg) => {
      const convId = msg.conversation;

      setMessages((prev) => {
        const existing = prev[convId] || [];
        return {
          ...prev,
          [convId]: [...existing, msg],
        };
      });
    });

    return () => socket.off("message:new");
  }, []);

  // -------------------- SEND MESSAGE --------------------
  const sendMessage = (e) => {
    e.preventDefault();
    if (!draft.trim() || !me || !active) return;

    const text = draft.trim();

    let socket = getSocket();
    if (!socket) return;

    socket.emit(
      "message:send",
      {
        conversationId: active,
        text,
        tempId: `temp-${Date.now()}`,
      },
      (ack) => {
        if (!ack?.ok) console.error("Message send failed:", ack);
      }
    );

    setDraft("");
  };

  // -------------------- CREATE CONVERSATION --------------------
  const createConversation = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const res = await fetch(`${API}/api/dev/seed-conv`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName.trim() }),
    });

    const data = await res.json();

    if (!data.success) return;

    const conv = data.data;

    setConversations((prev) => [
      {
        id: conv._id,
        name: conv.name,
        members: conv.members || [],
      },
      ...prev,
    ]);

    setMessages((prev) => ({
      ...prev,
      [conv._id]: [],
    }));

    setActive(conv._id);
    setNewModal(false);
  };

  // -------------------- ADD MEMBER --------------------
  const addMember = async (e) => {
    e.preventDefault();
    if (!addEmail.trim() || !active) return;

    const res = await fetch(`${API}/api/conversations/${active}/add-member`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email: addEmail.trim() }),
    });

    const data = await res.json();

    if (!data.success) {
      console.error("Add member error:", data);
      return;
    }

    const conv = data.data;

    setConversations((prev) =>
      prev.map((c) =>
        c.id === active
          ? {
              ...c,
              members: conv.members,
            }
          : c
      )
    );

    setAddModal(false);
  };

  const activeConv = conversations.find((c) => c.id === active);
  const msgs = active ? messages[active] || [] : [];

  // -------------------- UI STARTS HERE --------------------
  return (
    <div className={`min-h-screen ${BACKGROUND_COLOR} text-white relative`}>
      <GridOverlay />
      <LoggedInNavbar />

      <main className="max-w-7xl mx-auto px-6 pt-10 pb-20">
        <h1 className="text-3xl font-audiowide tracking-wide mb-6 text-center">
          Messages
        </h1>

        <div className="grid grid-cols-12 gap-6">
          {/* LEFT SIDEBAR */}
          <aside
            className={`col-span-12 md:col-span-4 lg:col-span-3 rounded-xl p-4 border ${BORDER_COLOR} ${FEATURE_BG}`}
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold text-lg">Chats</h2>
              <button
                onClick={() => setNewModal(true)}
                className={`px-3 py-1 text-sm rounded-md ${ACCENT_GRADIENT}`}
              >
                New
              </button>
            </div>

            {conversations.length === 0 ? (
              <p className="text-gray-400 text-sm">
                No chats. Create one above.
              </p>
            ) : (
              <ul className="space-y-2">
                {conversations.map((c) => (
                  <li key={c.id}>
                    <button
                      className={`w-full text-left rounded-lg px-3 py-2 border ${
                        active === c.id
                          ? "border-cyan-400 bg-cyan-500/10"
                          : `${BORDER_COLOR} hover:border-cyan-400`
                      }`}
                      onClick={() => setActive(c.id)}
                    >
                      <div className="font-medium">{c.name}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {c.members?.length || 0} members
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </aside>

          {/* CHAT WINDOW */}
          <section
            className={`col-span-12 md:col-span-8 lg:col-span-9 rounded-xl p-4 border ${BORDER_COLOR} ${FEATURE_BG}`}
          >
            {!activeConv ? (
              <p className="text-gray-400 text-center mt-20">
                Select a chat to start messaging.
              </p>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="font-semibold text-lg">{activeConv.name}</h2>
                    <p className="text-xs text-gray-400">
                      Members:{" "}
                      {activeConv.members
                        .map((m) => m.fullname || m.email || "Unknown")
                        .join(", ")}
                    </p>
                  </div>

                  <button
                    onClick={() => setAddModal(true)}
                    className={`px-3 py-1 rounded-md text-sm ${ACCENT_GRADIENT}`}
                  >
                    Add Member
                  </button>
                </div>

                {/* MESSAGES */}
                <div
                  className={`h-[55vh] overflow-y-auto rounded-xl p-3 border ${BORDER_COLOR} ${BACKGROUND_COLOR} space-y-3`}
                >
                  {msgs.map((m) => (
                    <div
                      key={m._id}
                      className={`flex ${
                        me && m.sender === me._id
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`px-3 py-2 rounded-lg max-w-[70%] border ${
                          me && m.sender === me._id
                            ? "bg-blue-600 border-blue-500"
                            : `${FEATURE_BG} ${BORDER_COLOR}`
                        }`}
                      >
                        {m.text}
                      </div>
                    </div>
                  ))}
                </div>

                {/* INPUT */}
                <form onSubmit={sendMessage} className="flex gap-2 mt-4">
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    className={`flex-1 px-3 py-2 rounded-lg border ${BORDER_COLOR} ${BACKGROUND_COLOR}`}
                    placeholder="Type a message..."
                  />
                  <button
                    type="submit"
                    className={`px-4 py-2 rounded-lg ${ACCENT_GRADIENT}`}
                  >
                    Send
                  </button>
                </form>
              </>
            )}
          </section>
        </div>
      </main>

      <Footer />

      {/* MODAL: NEW CHAT */}
      {newModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-20">
          <div
            className={`p-6 rounded-xl border ${BORDER_COLOR} ${FEATURE_BG} w-full max-w-md`}
          >
            <h3 className="font-semibold text-lg mb-3">New Conversation</h3>
            <form onSubmit={createConversation} className="space-y-4">
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border ${BORDER_COLOR} ${BACKGROUND_COLOR}`}
                placeholder="Conversation name..."
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNewModal(false)}
                  className="px-3 py-1 border rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-3 py-1 rounded-md ${ACCENT_GRADIENT}`}
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD MEMBER */}
      {addModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-20">
          <div
            className={`p-6 rounded-xl border ${BORDER_COLOR} ${FEATURE_BG} w-full max-w-md`}
          >
            <h3 className="font-semibold text-lg mb-3">Add Member</h3>
            <p className="text-sm text-gray-400 mb-3">
              Enter the member's email:
            </p>
            <form onSubmit={addMember} className="space-y-4">
              <input
                value={addEmail}
                onChange={(e) => setAddEmail(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border ${BORDER_COLOR} ${BACKGROUND_COLOR}`}
                placeholder="email@example.com"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddModal(false)}
                  className="px-3 py-1 border rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-3 py-1 rounded-md ${ACCENT_GRADIENT}`}
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
