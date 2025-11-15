// src/components/ai/chat/ChatBubble.jsx
import React from "react";
import { FEATURE_BG, BORDER_COLOR } from "../../../utils/constants";

export default function ChatBubble({ role, text, time, isOwn = false }) {
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`max-w-[80%] rounded-xl px-3 py-2 text-sm border ${
          isOwn
            ? "bg-blue-600 border-blue-500" // interviewer / "me"
            : `${FEATURE_BG} ${BORDER_COLOR} border` // other side (candidate / AI)
        }`}
      >
        {text}
      </div>
      {/* If you still want the timestamp, you can add it here or below in a second row */}
    </div>
  );
}
