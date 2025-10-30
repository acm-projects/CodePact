import React from "react";
import { Mail, Briefcase } from "lucide-react";

export default function NotificationCard({ data }) {
  const { type, text, time } = data;

  const icon =
    type === "message" ? (
      <Mail className="w-5 h-5 text-blue-400" />
    ) : (
      <Briefcase className="w-5 h-5 text-green-400" />
    );

  return (
    <div className="flex items-center gap-3 bg-[var(--panel)] border border-[var(--border)] rounded-xl p-3 hover:border-blue-500 transition">
      <div
        className={`p-2 rounded-lg ${
          type === "message" ? "bg-blue-900/40" : "bg-green-900/40"
        }`}
      >
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm">{text}</p>
        <p className="text-[var(--muted)] text-xs mt-0.5">{time} ago</p>
      </div>
      <button
        className="text-[var(--muted)] text-sm hover:text-[var(--accent)] transition"
        onClick={() => console.log("Open notification:", text)}
      >
        →
      </button>
    </div>
  );
}
