import React, { useState } from "react";
import { useActivity } from "./ActivityContext";

export default function AddActivityModal({ open, onClose }) {
  const { addActivity } = useActivity();
  const [tab, setTab] = useState("application");

  const handleSubmit = (activity) => {
    addActivity(activity);
    alert("Activity logged successfully!");
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-[#0f0f23] border border-gray-800 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <div className="flex gap-2 text-sm">
            {["application", "interview", "problem"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-1.5 rounded-lg border transition ${
                  tab === t
                    ? "border-blue-500 text-blue-300 bg-blue-500/10"
                    : "border-gray-700 text-gray-400 hover:text-white"
                }`}
              >
                {t[0].toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {tab === "application" && <ApplicationForm onSubmit={handleSubmit} />}
          {tab === "interview" && <InterviewForm onSubmit={handleSubmit} />}
          {tab === "problem" && <ProblemForm onSubmit={handleSubmit} />}
        </div>
      </div>
    </div>
  );
}

/* ---------- Application Form ---------- */
function ApplicationForm({ onSubmit }) {
  const [state, set] = useState({
    company: "",
    role: "",
    source: "ATS",
    appliedAt: new Date().toISOString().slice(0, 10),
    link: "",
    notes: "",
  });

  const save = () => {
    if (!state.company || !state.role)
      return alert("Company and Role are required");
    onSubmit({ kind: "application", ...state });
  };

  return (
    <div className="grid gap-3">
      <input
        className="input"
        placeholder="Company *"
        value={state.company}
        onChange={(e) => set({ ...state, company: e.target.value })}
      />
      <input
        className="input"
        placeholder="Role/Title *"
        value={state.role}
        onChange={(e) => set({ ...state, role: e.target.value })}
      />
      <select
        className="input"
        value={state.source}
        onChange={(e) => set({ ...state, source: e.target.value })}
      >
        <option>ATS</option>
        <option>Referral</option>
        <option>Portal</option>
        <option>Other</option>
      </select>
      <input
        className="input"
        type="date"
        value={state.appliedAt}
        onChange={(e) => set({ ...state, appliedAt: e.target.value })}
      />
      <input
        className="input"
        placeholder="Posting link (optional)"
        value={state.link}
        onChange={(e) => set({ ...state, link: e.target.value })}
      />
      <textarea
        className="input min-h-24"
        placeholder="Notes"
        value={state.notes}
        onChange={(e) => set({ ...state, notes: e.target.value })}
      />
      <div className="pt-2 flex justify-end">
        <button className="btn-primary" onClick={save}>
          Save Application
        </button>
      </div>
    </div>
  );
}

/* ---------- Interview Form ---------- */
function InterviewForm({ onSubmit }) {
  const [state, set] = useState({
    type: "virtual",
    company: "",
    role: "",
    stage: "screen",
    startAt: "",
    durationMin: 30,
    outcome: "scheduled",
    notes: "",
  });

  const save = () => {
    if (!state.company || !state.role || !state.startAt)
      return alert("Company, Role, and Date/Time are required");
    onSubmit({ kind: "interview", ...state });
  };

  return (
    <div className="grid gap-3">
      <div className="grid grid-cols-2 gap-3">
        <select
          className="input"
          value={state.type}
          onChange={(e) => set({ ...state, type: e.target.value })}
        >
          <option>phone</option>
          <option>virtual</option>
          <option>onsite</option>
          <option>mock</option>
        </select>
        <select
          className="input"
          value={state.stage}
          onChange={(e) => set({ ...state, stage: e.target.value })}
        >
          <option>screen</option>
          <option>oa</option>
          <option>tech</option>
          <option>behavioral</option>
          <option>final</option>
        </select>
      </div>
      <input
        className="input"
        placeholder="Company *"
        value={state.company}
        onChange={(e) => set({ ...state, company: e.target.value })}
      />
      <input
        className="input"
        placeholder="Role/Title *"
        value={state.role}
        onChange={(e) => set({ ...state, role: e.target.value })}
      />
      <input
        className="input"
        type="datetime-local"
        value={state.startAt}
        onChange={(e) => set({ ...state, startAt: e.target.value })}
      />
      <input
        className="input"
        type="number"
        min="5"
        max="240"
        value={state.durationMin}
        onChange={(e) => set({ ...state, durationMin: +e.target.value })}
        placeholder="Duration (minutes)"
      />
      <select
        className="input"
        value={state.outcome}
        onChange={(e) => set({ ...state, outcome: e.target.value })}
      >
        <option>scheduled</option>
        <option>completed</option>
        <option>offer</option>
        <option>rejected</option>
        <option>waiting</option>
      </select>
      <textarea
        className="input min-h-24"
        placeholder="Notes"
        value={state.notes}
        onChange={(e) => set({ ...state, notes: e.target.value })}
      />
      <div className="pt-2 flex justify-end">
        <button className="btn-primary" onClick={save}>
          Save Interview
        </button>
      </div>
    </div>
  );
}

/* ---------- Problem Form ---------- */
function ProblemForm({ onSubmit }) {
  const [state, set] = useState({
    platform: "LeetCode",
    problemId: "",
    difficulty: "Easy",
    solvedAt: new Date().toISOString().slice(0, 10),
  });

  const save = () => {
    if (!state.problemId) return alert("Problem ID is required");
    onSubmit({ kind: "problem", ...state });
  };

  return (
    <div className="grid gap-3">
      <div className="grid grid-cols-2 gap-3">
        <select
          className="input"
          value={state.platform}
          onChange={(e) => set({ ...state, platform: e.target.value })}
        >
          <option>LeetCode</option>
          <option>HackerRank</option>
          <option>Codeforces</option>
          <option>Other</option>
        </select>
        <select
          className="input"
          value={state.difficulty}
          onChange={(e) => set({ ...state, difficulty: e.target.value })}
        >
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
      </div>
      <input
        className="input"
        placeholder="Problem ID or URL *"
        value={state.problemId}
        onChange={(e) => set({ ...state, problemId: e.target.value })}
      />
      <input
        className="input"
        type="date"
        value={state.solvedAt}
        onChange={(e) => set({ ...state, solvedAt: e.target.value })}
      />
      <div className="pt-2 flex justify-end">
        <button className="btn-primary" onClick={save}>
          Save Problem
        </button>
      </div>
    </div>
  );
}
