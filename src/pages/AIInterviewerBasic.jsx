// src/pages/AIInterviewerBasic.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import LoggedInNavBar from "../components/nav/LoggedInNavBar.jsx"; // or LoggedInNavbar (match your filename)
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

export default function AIInterviewerBasic() {
  const q = useQuery();
  const role = q.get("role") || "interviewer";
  const room = q.get("room") || "—";

  const [remaining, setRemaining] = useState(15 * 60);
  useEffect(() => {
    const id = setInterval(() => setRemaining((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, []);

  const [chat, setChat] = useState([
    { role: "ai", text: "Welcome! Share your approach.", time: "2 min ago" },
  ]);
  const [msg, setMsg] = useState("");
  const [code, setCode] = useState("");

  const send = (t) => {
    const text = t?.trim?.() ?? msg.trim();
    if (!text) return;
    setChat((c) => [...c, { role: "user", text, time: "just now" }]);
    setMsg("");
  };

  return (
    <div
      className={`min-h-screen ${BACKGROUND_COLOR} text-white grid grid-rows-[auto_auto_1fr] relative overflow-hidden font-quicksand`}
    >
      <GridOverlay />
      <LoggedInNavBar />

      {/* Top strip */}
      <div
        className={`flex items-center justify-between ${FEATURE_BG} ${BORDER_COLOR} border-b px-4 sm:px-6 py-3`}
      >
        <span className="font-audiowide tracking-wider">
          Technical Coding Problem
        </span>
        <Timer seconds={remaining} className="font-semibold" />
      </div>

      {/* Role/room strip */}
      <div
        className={`${BACKGROUND_COLOR} ${BORDER_COLOR} border-b px-4 sm:px-6 py-2 text-sm`}
      >
        You are the <span className="font-semibold">{role}</span> in room{" "}
        <span className="font-mono">{room}</span>.
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-4 sm:gap-5 p-3 sm:p-5 max-w-[1400px] w-full mx-auto">
        <div className="space-y-4 sm:space-y-5">
          {/* Problem */}
          <Panel title="Problem">
            <p className="text-gray-300 mb-2">
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
              , return indices of the two numbers that add up to target.
            </p>
          </Panel>

          {/* Editor */}
          <Panel
            title="Editor"
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
        </div>

        {/* Right rail — AI Interviewer chat */}
        <Panel
          title="AI Interviewer"
          bodyClass="flex flex-col h-[560px] overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto pr-1 flex flex-col p-4">
            {chat.map((m, i) => (
              <ChatBubble key={i} role={m.role} text={m.text} time={m.time} />
            ))}
          </div>
          <div className={`${BORDER_COLOR} border-t`}>
            <ChatInput
              value={msg}
              onChange={setMsg}
              onSubmit={send}
              placeholder="Type your response..."
            />
          </div>
        </Panel>
      </div>

      <Footer />
    </div>
  );
}
