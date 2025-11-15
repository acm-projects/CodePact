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
import { aiAPI } from "../utils/api";

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
  const [msg, setMsg] = useState("");
  const [code, setCode] = useState("");

  const handleSend = async (text) => {
    const t = text?.trim?.() ?? msg.trim();
    if (!t) return;
    
    setChat((c) => [...c, { role: "user", text: t, time: "just now" }]);
    setMsg("");
    
    try {
      const result = await aiAPI.chatWithInterviewer(t);
      if (result.ok && result.data?.reply) {
        setChat((c) => [...c, { role: "ai", text: result.data.reply, time: "just now" }]);
      } else {
        setChat((c) => [...c, { role: "ai", text: "Sorry, I couldn't process that. Please try again.", time: "just now" }]);
      }
    } catch (error) {
      console.error("Error chatting with AI:", error);
      setChat((c) => [...c, { role: "ai", text: "An error occurred. Please try again.", time: "just now" }]);
    }
  };

  return (
    <div
      className={`min-h-screen ${BACKGROUND_COLOR} text-white grid grid-rows-[auto_auto_1fr] relative overflow-hidden font-quicksand`}
    >
      <GridOverlay />
      <LoggedInNavBar />

      <div
        className={`flex items-center justify-between ${FEATURE_BG} ${BORDER_COLOR} border-b px-4 sm:px-6 py-3`}
      >
        <span className="font-audiowide tracking-wider">
          Interview Session — Interviewee
        </span>
        <Timer seconds={remaining} className="font-semibold" />
      </div>

      <div
        className={`${BACKGROUND_COLOR} ${BORDER_COLOR} border-b px-4 sm:px-6 py-2 text-sm`}
      >
        You are the <span className="font-semibold">{role}</span> in room{" "}
        <span className="font-mono">{room}</span>.
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-4 sm:gap-5 p-3 sm:p-5 max-w-[1400px] w-full mx-auto">
        <div className="space-y-4 sm:space-y-5">
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
              className="min-h-[360px]"
              placeholder="// Write your solution here..."
            />
          </Panel>
        </div>

        <Panel
          title="Room Chat"
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
              onSubmit={handleSend}
              placeholder="Type your message..."
            />
          </div>
        </Panel>
      </div>

      <Footer />
    </div>
  );
}
