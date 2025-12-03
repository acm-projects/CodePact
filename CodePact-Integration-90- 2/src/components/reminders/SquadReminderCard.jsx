import React, { useState } from "react";

function getStatus(days) {
  if (days <= 2)
    return { label: "Active", color: "text-green-400", bar: "bg-green-400" };
  if (days <= 7)
    return { label: "Warm", color: "text-yellow-400", bar: "bg-yellow-400" };
  return { label: "Inactive", color: "text-red-400", bar: "bg-red-400" };
}

export default function SquadReminderCard({ member }) {
  const { name, lastActivityDays, type } = member;
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const status = getStatus(lastActivityDays);

  const handleRemind = async () => {
    if (sent || sending) return;
    setSending(true);
    await new Promise((r) => setTimeout(r, 600));
    console.log(`Reminder sent to ${name}`);
    setSending(false);
    setSent(true);
  };

  return (
    <div className="border border-[var(--border)] bg-[var(--panel)] rounded-xl p-4 flex flex-col gap-3">
      {/* Top Row  */}
      <div className="flex items-center justify-between">
        <h3 className="font-medium">{name}</h3>
        <div className="flex items-center gap-3">
          <span className={`text-xs ${status.color}`}>{status.label}</span>
          <button
            onClick={handleRemind}
            disabled={sent || sending}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium transition ${
              sent
                ? "bg-green-700 text-green-100"
                : sending
                ? "bg-[var(--border)] text-[var(--muted)] cursor-wait"
                : "bg-[var(--accent)] text-white hover:bg-blue-600"
            }`}
          >
            {sent ? "Sent ✓" : sending ? "Sending..." : "Remind"}
          </button>
        </div>
      </div>

      {/* Activity summary */}
      <p className="text-xs text-[var(--muted)]">
        {type === "application" ? "Last applied" : "Last solved"}{" "}
        <span className="text-[var(--text)]">
          {lastActivityDays} day{lastActivityDays !== 1 && "s"} ago
        </span>
      </p>

      {/* Progress bar */}
      <div className="w-full h-1 bg-[var(--border)] rounded-full">
        <div
          className={`${status.bar} h-1 rounded-full transition-all duration-300`}
          style={{
            width: `${Math.min((lastActivityDays / 14) * 100, 100)}%`,
          }}
        />
      </div>
    </div>
  );
}
