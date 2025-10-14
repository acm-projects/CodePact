import React from "react";

export default function SuggestedQuestions({ items = [], onPick }) {
  return (
    <div className="p-3 border-t border-[var(--border,#1a214b)]">
      <p className="text-[10px] uppercase tracking-wider text-[var(--muted,#a9b0d0)] mb-2">
        Suggested Questions
      </p>
      <div className="space-y-2">
        {items.map((q, i) => (
          <button
            key={i}
            onClick={() => onPick(q)}
            className="w-full text-left text-[12px] bg-black/25 hover:bg-black/35 px-3 py-2 rounded-lg"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
