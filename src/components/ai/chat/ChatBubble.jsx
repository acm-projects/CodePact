import React from "react";

export default function ChatBubble({ role = "ai", text, time = "just now" }) {
  return (
    <div
      className={`max-w-[92%] ${role === "user" ? "self-end" : "self-start"}`}
    >
      <div
        className={`rounded-2xl px-3.5 py-2.5 mb-1 ${
          role === "user" ? "bg-sky-600/30" : "bg-black/30"
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{text}</p>
      </div>
      <span className="block text-[10px] text-[var(--muted,#a9b0d0)] mb-3">
        {time}
      </span>
    </div>
  );
}
