// src/components/activity/AddActivityModal.jsx
import React, { useState } from "react";
import { useActivity } from "./ActivityContext";
import {
  BACKGROUND_COLOR,
  FEATURE_BG,
  BORDER_COLOR,
  ACCENT_GRADIENT,
} from "../../utils/constants";

export default function AddActivityModal({ open, onClose }) {
  const { addActivity } = useActivity();
  const [tab, setTab] = useState("application"); // only application | interview

  const handleSubmit = (activity) => {
    addActivity(activity);
    alert("Activity logged successfully!");
    const data = fetch("http://localhost:3000/incrementScore");
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 font-quicksand">
      <div
        className={`w-full max-w-2xl rounded-2xl ${FEATURE_BG} ${BORDER_COLOR} border shadow-2xl`}
      >
        {/* Header */}
        <div
          className={`px-5 py-4 ${BORDER_COLOR} border-b flex items-center justify-between`}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Log Activity</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="px-5 pt-4">
          <div className="inline-flex rounded-lg overflow-hidden border border-gray-700">
            {["application", "interview"].map((t) => {
              const active = tab === t;
              return (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-4 py-2 text-sm transition border-r last:border-r-0 border-gray-700 ${
                    active ? "text-white" : "text-gray-400 hover:text-white"
                  } ${
                    active
                      ? "bg-gradient-to-r from-cyan-500/20 via-fuchsia-500/20 to-pink-500/20"
                      : ""
                  }`}
                >
                  {t[0].toUpperCase() + t.slice(1)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {tab === "application" && <ApplicationForm onSubmit={handleSubmit} />}
          {tab === "interview" && <InterviewForm onSubmit={handleSubmit} />}
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
      <TextInput
        placeholder="Company *"
        value={state.company}
        onChange={(v) => set({ ...state, company: v })}
      />
      <TextInput
        placeholder="Role/Title *"
        value={state.role}
        onChange={(v) => set({ ...state, role: v })}
      />

      <Select
        value={state.source}
        onChange={(v) => set({ ...state, source: v })}
        options={["ATS", "Referral", "Portal", "Other"]}
      />

      <TextInput
        type="date"
        value={state.appliedAt}
        onChange={(v) => set({ ...state, appliedAt: v })}
      />
      <TextInput
        placeholder="Posting link (optional)"
        value={state.link}
        onChange={(v) => set({ ...state, link: v })}
      />

      <Textarea
        placeholder="Notes"
        value={state.notes}
        onChange={(v) => set({ ...state, notes: v })}
      />

      <div className="pt-2 flex justify-end">
        <PrimaryButton onClick={save}>Save Application</PrimaryButton>
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
        <Select
          value={state.type}
          onChange={(v) => set({ ...state, type: v })}
          options={["phone", "virtual", "onsite", "mock"]}
        />
        <Select
          value={state.stage}
          onChange={(v) => set({ ...state, stage: v })}
          options={["screen", "oa", "tech", "behavioral", "final"]}
        />
      </div>

      <TextInput
        placeholder="Company *"
        value={state.company}
        onChange={(v) => set({ ...state, company: v })}
      />
      <TextInput
        placeholder="Role/Title *"
        value={state.role}
        onChange={(v) => set({ ...state, role: v })}
      />
      <TextInput
        type="datetime-local"
        value={state.startAt}
        onChange={(v) => set({ ...state, startAt: v })}
      />
      <TextInput
        type="number"
        min="5"
        max="240"
        value={state.durationMin}
        onChange={(v) => set({ ...state, durationMin: +v })}
        placeholder="Duration (minutes)"
      />
      <Select
        value={state.outcome}
        onChange={(v) => set({ ...state, outcome: v })}
        options={["scheduled", "completed", "offer", "rejected", "waiting"]}
      />
      <Textarea
        placeholder="Notes"
        value={state.notes}
        onChange={(v) => set({ ...state, notes: v })}
      />

      <div className="pt-2 flex justify-end">
        <PrimaryButton onClick={save}>Save Interview</PrimaryButton>
      </div>
    </div>
  );
}

/* ---------- Reusable form primitives (styled with tokens) ---------- */

function TextInput({ value, onChange, placeholder, type = "text", ...rest }) {
  return (
    <input
      {...rest}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full rounded-lg px-3 py-2 text-sm outline-none transition
        ${BACKGROUND_COLOR} ${BORDER_COLOR} border
        focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/60`}
    />
  );
}

function Textarea({ value, onChange, placeholder }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full min-h-24 rounded-lg px-3 py-2 text-sm outline-none transition
        ${BACKGROUND_COLOR} ${BORDER_COLOR} border
        focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/60`}
    />
  );
}

function Select({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full rounded-lg px-3 py-2 text-sm outline-none transition
        ${BACKGROUND_COLOR} ${BORDER_COLOR} border
        focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/60`}
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}

function PrimaryButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-semibold shadow hover:brightness-110 ${ACCENT_GRADIENT} text-white`}
    >
      {children}
    </button>
  );
}
