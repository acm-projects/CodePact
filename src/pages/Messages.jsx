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
  const [threads] = useState([
    {
      id: "t1",
      name: "Algorithm Avengers",
      last: "Standup @ 6p today?",
      unread: 2,
    },
    { id: "t2", name: "Rafay", last: "Pushed the fixes to navbar.", unread: 0 },
    {
      id: "t3",
      name: "Nabiha",
      last: "Try constants in Welcome.jsx",
      unread: 1,
    },
  ]);
  const [activeId, setActiveId] = useState("t1");
  const [messages, setMessages] = useState([
    { id: 1, who: "them", text: "Standup @ 6p today?" },
    { id: 2, who: "me", text: "Works for me!" },
  ]);
  const [draft, setDraft] = useState("");

  const activeThread = threads.find((t) => t.id === activeId);

  const send = (e) => {
    e.preventDefault();
    if (!draft.trim()) return;
    setMessages((ms) => [
      ...ms,
      { id: Date.now(), who: "me", text: draft.trim() },
    ]);
    setDraft("");
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
                        {t.last}
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
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-audiowide tracking-wider">
                {activeThread?.name ?? "Select a conversation"}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  className={`px-3 py-1 rounded-lg text-sm font-semibold shadow hover:brightness-110 ${ACCENT_GRADIENT}`}
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
                placeholder="Type a message…"
                className={`flex-1 rounded-lg px-3 py-2 text-sm ${BACKGROUND_COLOR} ${BORDER_COLOR} border`}
              />
              <button
                className={`px-4 py-2 rounded-lg text-sm font-semibold shadow hover:brightness-110 ${ACCENT_GRADIENT}`}
              >
                Send
              </button>
            </form>
          </section>
        </div>

        <Footer />
      </main>
    </div>
  );
}
