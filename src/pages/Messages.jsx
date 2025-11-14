import React, { useState } from "react";
import LoggedInNavbar from "../components/nav/LoggedInNavBar";
import Footer from "../components/Footer";
import {
  BACKGROUND_COLOR,
  FEATURE_BG,
  BORDER_COLOR,
  ACCENT_GRADIENT,
  GridOverlay,
} from "../utils/constants";

export default function Messages() {
  // 🔹 Conversations (threads)
  const [threads, setThreads] = useState([
    {
      id: "t1",
      name: "Algorithm Avengers",
      last: "Standup @ 6p today?",
      unread: 2,
      members: ["You", "Rafay", "Nabiha", "Tharun"],
    },
    {
      id: "t2",
      name: "Rafay",
      last: "Pushed the fixes to navbar.",
      unread: 0,
      members: ["You", "Rafay"],
    },
    {
      id: "t3",
      name: "Nabiha",
      last: "Try constants in Welcome.jsx",
      unread: 1,
      members: ["You", "Nabiha"],
    },
  ]);

  const [activeId, setActiveId] = useState("t1");

  // 🔹 Messages stored per-thread
  const [messagesByThread, setMessagesByThread] = useState({
    t1: [
      { id: 1, who: "them", text: "Standup @ 6p today?" },
      { id: 2, who: "me", text: "Works for me!" },
    ],
    t2: [{ id: 3, who: "them", text: "Pushed the fixes to navbar." }],
    t3: [{ id: 4, who: "them", text: "Try constants in Welcome.jsx" }],
  });

  const [draft, setDraft] = useState("");

  // 🔹 Modal state for "New" conversation
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [newName, setNewName] = useState("");

  // 🔹 Modal state for "Add Member"
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newMember, setNewMember] = useState("");

  const activeThread = threads.find((t) => t.id === activeId);
  const messages = activeId ? messagesByThread[activeId] || [] : [];

  const send = (e) => {
    e.preventDefault();
    if (!draft.trim() || !activeId) return;

    const text = draft.trim();
    const newMessage = { id: Date.now(), who: "me", text };

    setMessagesByThread((prev) => {
      const existing = prev[activeId] || [];
      return {
        ...prev,
        [activeId]: [...existing, newMessage],
      };
    });

    // Update last message preview + clear unread on that thread
    setThreads((prev) =>
      prev.map((t) => (t.id === activeId ? { ...t, last: text, unread: 0 } : t))
    );

    setDraft("");
  };

  // 🔹 "New" button handlers
  const openNewModal = () => {
    setNewName("");
    setIsNewOpen(true);
  };

  const createNewConversation = (e) => {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;

    const id = `t-${Date.now()}`;

    setThreads((prev) => [
      {
        id,
        name,
        last: "",
        unread: 0,
        members: ["You", name],
      },
      ...prev,
    ]);

    setMessagesByThread((prev) => ({
      ...prev,
      [id]: [],
    }));

    setActiveId(id);
    setIsNewOpen(false);
  };

  // 🔹 "Add Member" handlers
  const openAddMemberModal = () => {
    if (!activeThread) return;
    setNewMember("");
    setIsAddOpen(true);
  };

  const handleAddMember = (e) => {
    e.preventDefault();
    const member = newMember.trim();
    if (!member || !activeThread) return;

    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeThread.id
          ? {
              ...t,
              members: t.members?.includes(member)
                ? t.members
                : [...(t.members || []), member],
            }
          : t
      )
    );

    setIsAddOpen(false);
  };

  return (
    <div
      className={`min-h-screen ${BACKGROUND_COLOR} text-white relative overflow-hidden font-quicksand`}
    >
      <GridOverlay />
      <LoggedInNavbar />

      {/* ✅ Centered Gradient Header */}
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
      {/* ✅ End Header */}

      <main className="max-w-7xl mx-auto px-6 pb-12 relative z-10">
        <div className="grid grid-cols-12 gap-6">
          {/* Threads list */}
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
          </aside>

          {/* Chat Pane */}
          <section
            className={`col-span-12 md:col-span-8 lg:col-span-9 rounded-2xl ${FEATURE_BG} ${BORDER_COLOR} border p-4 md:p-6`}
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-lg font-audiowide tracking-wider">
                  {activeThread?.name ?? "Select a conversation"}
                </h2>
                {activeThread?.members && activeThread.members.length > 0 && (
                  <p className="text-xs text-gray-400 mt-1">
                    Members: {activeThread.members.join(", ")}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={openAddMemberModal}
                  disabled={!activeThread}
                  className={`px-3 py-1 rounded-lg text-sm font-semibold shadow hover:brightness-110 ${ACCENT_GRADIENT} ${
                    !activeThread ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  Add Member
                </button>
                <button
                  className={`px-3 py-1 rounded-lg text-sm font-semibold ${BORDER_COLOR} border hover:border-cyan-400/60`}
                >
                  Info
                </button>
              </div>
            </div>

            <div
              className={`h-[48vh] md:h-[58vh] rounded-xl overflow-y-auto p-3 space-y-3 ${BACKGROUND_COLOR} ${BORDER_COLOR} border`}
            >
              {messages.length === 0 && (
                <p className="text-sm text-gray-500 text-center mt-4">
                  No messages yet. Start the conversation below.
                </p>
              )}
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${
                    m.who === "me" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl px-3 py-2 text-sm border ${
                      m.who === "me"
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
                  activeThread ? "Type a message…" : "Select or create a chat…"
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
            <p className="text-sm text-gray-400 mb-4">
              Who do you want to start a conversation with?
            </p>
            <form onSubmit={createNewConversation} className="space-y-4">
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Name (e.g., Rafay, Algorithm Avengers)"
                className={`w-full rounded-lg px-3 py-2 text-sm ${BACKGROUND_COLOR} ${BORDER_COLOR} border`}
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewOpen(false)}
                  className={`px-3 py-1 rounded-lg text-sm font-semibold ${BORDER_COLOR} border hover:border-cyan-400/60`}
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

      {/* 🔹 Add Member Modal */}
      {isAddOpen && activeThread && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/60">
          <div
            className={`w-full max-w-md rounded-2xl p-6 ${FEATURE_BG} ${BORDER_COLOR} border`}
          >
            <h3 className="text-lg font-semibold mb-3">
              Add Member to {activeThread.name}
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Enter the name of the member you want to add.
            </p>
            <form onSubmit={handleAddMember} className="space-y-4">
              <input
                value={newMember}
                onChange={(e) => setNewMember(e.target.value)}
                placeholder="Member name"
                className={`w-full rounded-lg px-3 py-2 text-sm ${BACKGROUND_COLOR} ${BORDER_COLOR} border`}
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className={`px-3 py-1 rounded-lg text-sm font-semibold ${BORDER_COLOR} border hover:border-cyan-400/60`}
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
