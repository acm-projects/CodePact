// src/pages/AIIntervieweeSession.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import LoggedInNavBar from "../components/nav/LoggedInNavBar.jsx";
import Footer from "../components/Footer.jsx";

import Timer from "../components/ai/Timer.jsx";
import CodeEditor from "../components/ai/CodeEditor.jsx";
import Panel from "../components/ai/Panel.jsx";
import ChatBubble from "../components/ai/chat/ChatBubble.jsx";
import ChatInput from "../components/ai/chat/ChatInput.jsx";

import {
  BACKGROUND_COLOR,
  FEATURE_BG,
  BORDER_COLOR,
  ACCENT_GRADIENT,
  GridOverlay,
} from "../utils/constants";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function AIIntervieweeSession() {
  const q = useQuery();
  const role = (q.get("role") || "interviewee").toLowerCase();
  const room = q.get("room") || "—";

  const [remaining, setRemaining] = useState(15 * 60);
  useEffect(() => {
    const id = setInterval(() => setRemaining((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, []);

  const [chat, setChat] = useState([
    {
      role: "ai",
      text: "Welcome! Focus on implementing the solution. Ask clarifying questions if needed.",
      time: "2 min ago",
    },
  ]);
  const [code, setCode] = useState("");

  const pushChat = (msgRole, text) =>
    setChat((c) => [...c, { role: msgRole, text, time: "now" }]);

  // Called by ChatInput with the raw text
  const send = (raw) => {
    if (typeof raw !== "string") raw = "";
    const cleaned = raw.replace(/\s+/g, " ").trim();
    if (!cleaned) return;

    // On this page, "own" messages are from the interviewee / candidate
    pushChat("candidate", cleaned);
  };

  return (
    <div
      className={`min-h-screen ${BACKGROUND_COLOR} text-white grid grid-rows-[auto_auto_1fr] relative overflow-hidden font-quicksand`}
    >
      <GridOverlay />
      <LoggedInNavBar />

      {/* Top bar – aligned with interviewer page */}
      <div
        className={`flex items-center justify-between ${FEATURE_BG} ${BORDER_COLOR} border-b px-4 sm:px-6 py-3`}
      >
        <span className="font-audiowide tracking-wider">
          Interview – Interviewee
        </span>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">
            Room <span className="font-mono text-white">{room}</span>
          </span>
          <Timer seconds={remaining} className="font-semibold" />
        </div>
      </div>

      {/* Main grid – same structure as interviewer page */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-4 sm:gap-5 p-3 sm:p-5 max-w-[1400px] w-full mx-auto">
        {/* LEFT: Shared editor + chat */}
        <div className="space-y-4 sm:space-y-5">
          <Panel
            title="Shared Editor"
            right={<span className="text-xs text-gray-400">JS • Node 18</span>}
            padded={false}
          >
            <CodeEditor
              value={code}
              onChange={setCode}
              language="javascript"
              height={360}
              placeholder="// Write your solution here..."
            />
          </Panel>

          <Panel
            title="Room Chat"
            bodyClass="flex flex-col h-[320px] overflow-hidden"
          >
            <div className="flex-1 overflow-y-auto pr-1 flex flex-col p-4">
              {chat.map((m, i) => (
                <ChatBubble
                  key={i}
                  role={m.role}
                  text={m.text}
                  time={m.time}
                  // interviewee's own messages are blue/right
                  isOwn={m.role === "candidate"}
                />
              ))}
            </div>
            <div className={`${BORDER_COLOR} border-t`}>
              <ChatInput onSend={send} placeholder="Type your message..." />
            </div>
          </Panel>
        </div>

        {/* RIGHT: Problem panel (like AI Question on interviewer page) */}
        <aside className="space-y-4">
          <Panel
            title="Problem"
            right={
              <span
                className={`text-xs ${FEATURE_BG} ${BORDER_COLOR} border px-2 py-1 rounded-lg`}
              >
                Easy • Arrays
              </span>
            }
          >
            <p className="text-sm leading-relaxed text-gray-200 mb-2">
              Given an array of integers{" "}
              <code
                className={`${FEATURE_BG} ${BORDER_COLOR} border px-1 rounded`}
              >
                nums
              </code>{" "}
              and an integer{" "}
              <code
                className={`${FEATURE_BG} ${BORDER_COLOR} border px-1 rounded`}
              >
                target
              </code>
              , return the indices of the two numbers such that they add up to{" "}
              <code
                className={`${FEATURE_BG} ${BORDER_COLOR} border px-1 rounded`}
              >
                target
              </code>
              . Assume exactly one solution and you may not use the same element
              twice.
            </p>
            <p className="text-xs text-gray-400">
              Discuss your approach out loud and keep an eye on edge cases (e.g.
              duplicates, negative numbers).
            </p>
          </Panel>
        </aside>
      </div>

      <Footer />
    </div>
  );
}
