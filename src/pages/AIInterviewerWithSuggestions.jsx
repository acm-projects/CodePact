// src/pages/AIInterviewerWithSuggestions.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LoggedInNavBar from "../components/nav/LoggedInNavbar.jsx";
import Footer from "../components/Footer.jsx";

import Timer from "../components/ai/Timer.jsx";
import CodeEditor from "../components/ai/CodeEditor.jsx";
import Panel from "../components/ai/Panel.jsx";
import ChatBubble from "../components/ai/chat/ChatBubble.jsx";
import ChatInput from "../components/ai/chat/ChatInput.jsx";
import SuggestedQuestions from "../components/ai/chat/SuggestedQuestions.jsx";

import {
  BACKGROUND_COLOR,
  FEATURE_BG,
  BORDER_COLOR,
  ACCENT_GRADIENT,
  GridOverlay,
} from "../utils/constants";

// ---- Fake AI question generator (stub) ----
const SAMPLE_QUESTIONS = [
  {
    id: "q1",
    title: "Two Sum",
    body: "Given an array of integers nums and an integer target, return the indices of two numbers that add up to target. Assume exactly one solution.",
    difficulty: "Easy",
    tags: ["Arrays", "HashMap"],
  },
  {
    id: "q2",
    title: "Valid Parentheses",
    body: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    difficulty: "Easy",
    tags: ["Stack", "Strings"],
  },
  {
    id: "q3",
    title: "Merge Intervals",
    body: "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
    difficulty: "Medium",
    tags: ["Intervals", "Sorting"],
  },
  {
    id: "q4",
    title: "LRU Cache",
    body: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache, implementing get and put with O(1) average time.",
    difficulty: "Medium",
    tags: ["Design", "HashMap", "Doubly Linked List"],
  },
];

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function AIInterviewerWithSuggestions() {
  const q = useQuery();
  const role = (q.get("role") || "interviewer").toLowerCase();
  const room = q.get("room") || "—";
  const navigate = useNavigate();

  const [questionIdx, setQuestionIdx] = useState(0);
  const [current, setCurrent] = useState(SAMPLE_QUESTIONS[0]);
  const [code, setCode] = useState("");
  const [chat, setChat] = useState([
    {
      role: "ai",
      text: "Welcome! You can ask guiding questions and nudge the candidate.",
      time: "2 min ago",
    },
  ]);

  const PER_QUESTION_SECONDS = 6 * 60;
  const [remaining, setRemaining] = useState(PER_QUESTION_SECONDS);
  useEffect(() => {
    const id = setInterval(() => setRemaining((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, []);

  const [notes, setNotes] = useState("");

  const suggestions = [
    "What edge cases should we consider?",
    "Could you analyze the time complexity?",
    "How would you optimize memory usage?",
    "Can you explain your logic out loud?",
    "What tests would you write first?",
  ];

  const nextQuestion = () => {
    const nextIdx = (questionIdx + 1) % SAMPLE_QUESTIONS.length;
    setQuestionIdx(nextIdx);
    setCurrent(SAMPLE_QUESTIONS[nextIdx]);
    setRemaining(PER_QUESTION_SECONDS);
  };

  const endInterview = () => {
    navigate("/interview/feedback", {
      state: {
        room,
        role,
        askedQuestions: Array.from(new Set([SAMPLE_QUESTIONS[questionIdx].id])),
      },
    });
  };

  const pushChat = (msgRole, text) =>
    setChat((c) => [...c, { role: msgRole, text, time: "now" }]);

  // 🔹 Suggested questions are for the interviewer, so treat them as interviewer messages
  const onPickSuggestion = (text) => {
    const senderRole = role === "interviewer" ? "interviewer" : "candidate";
    pushChat(senderRole, text);
  };

  // 👇 This is what ChatInput calls with the raw text
  const send = async (raw) => {
    if (typeof raw !== "string") raw = "";

    // Collapse ALL whitespace (spaces, newlines, tabs) into single spaces
    const cleaned = raw.replace(/\s+/g, " ").trim();
    if (!cleaned) return;

    const senderRole = role === "interviewer" ? "interviewer" : "candidate";
    pushChat("user", cleaned);
    const data = await fetch(`http://localhost:3000/chat?text=${encodeURIComponent(cleaned)}`);
    const response = await data.json();
    console.log("CLEANED: "+cleaned);
    pushChat("ai",response.reply);
  };

  return (
    <div
      className={`min-h-screen ${BACKGROUND_COLOR} text-white grid grid-rows-[auto_auto_1fr] relative overflow-hidden font-quicksand`}
    >
      <GridOverlay />
      <LoggedInNavBar />

      {/* Top bar */}
      <div
        className={`flex items-center justify-between ${FEATURE_BG} ${BORDER_COLOR} border-b px-4 sm:px-6 py-3`}
      >
        <span className="font-audiowide tracking-wider">
          Interview – Interviewer
        </span>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">
            Room <span className="font-mono text-white">{room}</span>
          </span>
          <Timer seconds={remaining} className="font-semibold" />
        </div>
      </div>

      {/* Main grid */}
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
              placeholder="// Candidate's code will appear here..."
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
                  isOwn={m.role === "interviewer"}
                />
              ))}
            </div>
            <div className={`${BORDER_COLOR} border-t`}>
              {/* ChatInput manages its own internal msg; we just get text via onSend */}
              <ChatInput onSend={send} placeholder="Type your message..." />
            </div>
          </Panel>
        </div>

        {/* RIGHT: AI Question + Notepad + Suggestions */}
        <aside className="space-y-4">
          <Panel
            title="AI Question"
            right={
              <span
                className={`text-xs ${FEATURE_BG} ${BORDER_COLOR} border px-2 py-1 rounded-lg`}
              >
                {current.difficulty}
              </span>
            }
          >
            <p className="text-sm text-gray-300 mb-2">
              {current.tags.map((t) => (
                <span
                  key={t}
                  className={`mr-2 inline-block text-xs px-2 py-0.5 rounded-full ${FEATURE_BG} ${BORDER_COLOR} border`}
                >
                  #{t}
                </span>
              ))}
            </p>
            <h4 className="font-semibold mb-2">{current.title}</h4>
            <p className="text-sm leading-relaxed text-gray-200">
              {current.body}
            </p>
            <div className="mt-3 text-xs">
              <span className="font-semibold">
                Time left <Timer seconds={remaining} inline />
              </span>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={nextQuestion}
                className={`px-3 py-2 rounded-xl text-sm font-semibold shadow hover:brightness-110 ${ACCENT_GRADIENT}`}
              >
                Next Question
              </button>
              <button
                onClick={endInterview}
                className={`px-3 py-2 rounded-xl text-sm ${FEATURE_BG} ${BORDER_COLOR} border hover:border-rose-500/60`}
              >
                End Interview
              </button>
            </div>
          </Panel>

          <Panel title="Private Notepad" subtitle="Visible only to interviewer">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Write private feedback notes here…"
              className={`w-full min-h-[160px] rounded-xl p-3 text-sm outline-none resize-vertical ${BACKGROUND_COLOR} ${BORDER_COLOR} border focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/60`}
            />
          </Panel>

          <Panel title="Suggested Questions">
            <SuggestedQuestions items={suggestions} onPick={onPickSuggestion} />
          </Panel>
        </aside>
      </div>

      <Footer />
    </div>
  );
}