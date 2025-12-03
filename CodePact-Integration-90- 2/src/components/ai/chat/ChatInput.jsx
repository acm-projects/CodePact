import React, { useState } from "react";

export default function ChatInput({ onSend, placeholder }) {
  const [msg, setMsg] = useState("");
  const send = () => {
    if (msg.trim()) {
      onSend(msg);
      setMsg("");
    }
  };
  return (
    <div className="flex items-end gap-2 p-3 border-t border-[var(--border,#1a214b)]">
      <textarea
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        placeholder={placeholder || "Type your response..."}
        rows={1}
        className="flex-1 bg-black/30 rounded-xl p-2.5 text-sm outline-none min-h-[44px] max-h-40 resize-y"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            send();
          }
        }}
      />
      <button
        onClick={send}
        className="px-3 py-2 rounded-xl bg-sky-600/40 hover:bg-sky-600/50 text-sm"
      >
        Send
      </button>
    </div>
  );
}
