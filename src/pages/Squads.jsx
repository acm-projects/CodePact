// src/pages/Squads.jsx
import React, { useState } from "react";
import Footer from "../components/Footer";
import LoggedInNavbar from "../components/nav/LoggedInNavbar"; // or LoggedInNavBar
import {
  BACKGROUND_COLOR,
  ACCENT_GRADIENT,
  FEATURE_BG,
  BORDER_COLOR,
  GridOverlay,
} from "../utils/constants";

export default function Squads() {
  // --- Mocked multi-squad store (each squad has its own data/state) ---
  const INITIAL_SQUADS = {
    s1: {
      id: "s1",
      name: "Fall Placements",
      members: [
        {
          id: 1,
          name: "Rafay",
          role: "Owner",
          focus: "Apps (3/wk)",
          lastDays: 2,
          lastType: "problem",
        },
        {
          id: 2,
          name: "Nabiha",
          role: "Member",
          focus: "DSA (5/wk)",
          lastDays: 8,
          lastType: "application",
        },
        {
          id: 3,
          name: "Tharun",
          role: "Member",
          focus: "Mocks (2/wk)",
          lastDays: 14,
          lastType: "problem",
        },
        {
          id: 4,
          name: "Adi",
          role: "Member",
          focus: "Projects (1/wk)",
          lastDays: 1,
          lastType: "interview",
        },
      ],
      rituals: [
        {
          id: "r1",
          title: "Daily Check-in",
          when: "Everyday · 9:00 AM",
          type: "standup",
        },
        {
          id: "r2",
          title: "Mock Interview",
          when: "Wed · 6:00 PM",
          type: "mock",
        },
        {
          id: "r3",
          title: "Weekly Retro",
          when: "Sun · 7:00 PM",
          type: "retro",
        },
      ],
      commitments: [
        { id: 1, memberId: 1, text: "Apply to 3 roles", done: false },
        { id: 2, memberId: 2, text: "Solve 5 DSA problems", done: true },
        { id: 3, memberId: 3, text: "2 mock interviews", done: false },
      ],
      pins: [
        { id: "p1", title: "Resume master doc", url: "#", by: "Rafay" },
        { id: "p2", title: "DSA sheet (Top 75)", url: "#", by: "Nabiha" },
      ],
      recentReminders: [{ id: "rr1", name: "Tharun", when: "15m ago" }],
    },
    s2: {
      id: "s2",
      name: "DSA Grind",
      members: [
        {
          id: 1,
          name: "Rafay",
          role: "Owner",
          focus: "DSA (7/wk)",
          lastDays: 0,
          lastType: "problem",
        },
        {
          id: 5,
          name: "Sara",
          role: "Member",
          focus: "System Design",
          lastDays: 9,
          lastType: "interview",
        },
        {
          id: 6,
          name: "Ishan",
          role: "Member",
          focus: "Apps (2/wk)",
          lastDays: 11,
          lastType: "application",
        },
      ],
      rituals: [
        {
          id: "r4",
          title: "LeetCode Sprint",
          when: "Tue · 8:00 PM",
          type: "practice",
        },
        {
          id: "r5",
          title: "Whiteboard Friday",
          when: "Fri · 5:00 PM",
          type: "mock",
        },
      ],
      commitments: [
        { id: 11, memberId: 1, text: "Finish DP playlist", done: false },
        { id: 12, memberId: 5, text: "1 sys-design outline", done: false },
      ],
      pins: [{ id: "p3", title: "Neetcode patterns", url: "#", by: "Ishan" }],
      recentReminders: [],
    },
    s3: {
      id: "s3",
      name: "Project Builders",
      members: [
        {
          id: 1,
          name: "Rafay",
          role: "Owner",
          focus: "Projects (2/wk)",
          lastDays: 3,
          lastType: "project",
        },
        {
          id: 7,
          name: "Ava",
          role: "Member",
          focus: "Docs & QA",
          lastDays: 5,
          lastType: "project",
        },
      ],
      rituals: [
        { id: "r6", title: "Demo Day", when: "Sat · 4:00 PM", type: "demo" },
      ],
      commitments: [
        { id: 21, memberId: 7, text: "Write README and tests", done: false },
      ],
      pins: [{ id: "p4", title: "API checklist", url: "#", by: "Ava" }],
      recentReminders: [],
    },
  };

  const [squads, setSquads] = useState(INITIAL_SQUADS);
  const [selectedSquadId, setSelectedSquadId] = useState("s1");

  // --- Derived for convenience ---
  const squad = squads[selectedSquadId];
  const MEMBERS = squad.members;
  const RITUALS = squad.rituals;
  const commitments = squad.commitments;
  const pins = squad.pins;
  const recentReminders = squad.recentReminders;

  // --- UI state for "add commitment" input ---
  const [newCommit, setNewCommit] = useState({
    memberId: MEMBERS[0]?.id ?? 0,
    text: "",
  });

  // --- Helpers ---
  const INACTIVE_DAYS = 7;
  const isInactive = (days) => days >= INACTIVE_DAYS;
  const typeLabel = (t) =>
    t === "application"
      ? "Applications"
      : t === "problem"
      ? "Problems"
      : t === "interview"
      ? "Mock Interviews"
      : "Activity";

  // --- Mutators that are squad-aware ---
  const updateSquad = (updater) =>
    setSquads((prev) => ({
      ...prev,
      [selectedSquadId]: updater(prev[selectedSquadId]),
    }));

  const toggleCommit = (id) =>
    updateSquad((cur) => ({
      ...cur,
      commitments: cur.commitments.map((c) =>
        c.id === id ? { ...c, done: !c.done } : c
      ),
    }));

  const addCommit = (e) => {
    e.preventDefault();
    if (!newCommit.text.trim()) return;
    updateSquad((cur) => ({
      ...cur,
      commitments: [
        ...cur.commitments,
        {
          id: Date.now(),
          memberId: Number(newCommit.memberId),
          text: newCommit.text.trim(),
          done: false,
        },
      ],
    }));
    setNewCommit({ memberId: MEMBERS[0]?.id ?? 0, text: "" });
  };

  const removeCommit = (id) =>
    updateSquad((cur) => ({
      ...cur,
      commitments: cur.commitments.filter((c) => c.id !== id),
    }));

  const handleRemind = (member) =>
    updateSquad((cur) => ({
      ...cur,
      recentReminders: [
        { id: String(Date.now()), name: member.name, when: "just now" },
        ...cur.recentReminders,
      ].slice(0, 5),
    }));

  const addPin = () => {
    const title = prompt("Title");
    const url = prompt("URL");
    if (title && url) {
      updateSquad((cur) => ({
        ...cur,
        pins: [...cur.pins, { id: String(Date.now()), title, url, by: "You" }],
      }));
    }
  };

  // When switching squads, keep the add-commit select pointing to a valid member
  const onChangeSquad = (e) => {
    const nextId = e.target.value;
    setSelectedSquadId(nextId);
    const nextMembers = squads[nextId].members;
    setNewCommit((s) => ({ ...s, memberId: nextMembers[0]?.id ?? 0 }));
  };

  return (
    <div
      className={`min-h-screen ${BACKGROUND_COLOR} text-white relative overflow-hidden font-quicksand`}
    >
      <GridOverlay />
      <LoggedInNavbar />

      {/* Hero */}
      <section className="relative mb-10">
        <div
          className={`absolute inset-0 pointer-events-none opacity-20 ${ACCENT_GRADIENT}`}
        />
        <div className="relative max-w-7xl mx-auto px-6 pt-10 pb-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-audiowide uppercase">
                Your Squad
              </h1>
              <p className="text-gray-300">
                Set commitments, run lightweight check-ins, and keep each other
                accountable.
              </p>
            </div>

            {/* Squad Selector + Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 md:gap-3">
              <label className="sr-only" htmlFor="squad-select">
                Select squad
              </label>
              <select
                id="squad-select"
                value={selectedSquadId}
                onChange={onChangeSquad}
                className={`rounded-xl px-3 py-2 text-sm ${BACKGROUND_COLOR} ${BORDER_COLOR} border`}
              >
                {Object.values(squads).map((sq) => (
                  <option key={sq.id} value={sq.id}>
                    {sq.name}
                  </option>
                ))}
              </select>

              <button
                className={`px-4 py-2 rounded-xl ${FEATURE_BG} ${BORDER_COLOR} border hover:border-gray-500 text-sm font-medium transition`}
              >
                Manage Members
              </button>
              <button className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-sm font-semibold shadow-lg shadow-blue-600/20 transition">
                Copy Invite Link
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 pb-12 space-y-8">
        {/* Top Grid */}
        <section className="grid lg:grid-cols-3 gap-6">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-audiowide tracking-wider text-lg">
                Members & Roles
              </h2>
              <span className="text-xs text-gray-400">{squad.name}</span>
            </div>
            <ul className="space-y-3 text-sm">
              {MEMBERS.map((m) => (
                <li
                  key={m.id}
                  className={`flex items-center justify-between rounded-lg ${BACKGROUND_COLOR} ${BORDER_COLOR} border p-3`}
                >
                  <div>
                    <div className="font-semibold">{m.name}</div>
                    <div className="text-gray-400">
                      {m.role} • Focus: {m.focus}
                    </div>
                  </div>
                  <button
                    className={`text-xs px-2 py-1 rounded-lg ${FEATURE_BG} ${BORDER_COLOR} border hover:border-blue-500 transition`}
                  >
                    Rotate Role
                  </button>
                </li>
              ))}
            </ul>
          </Card>

          {/* Commitments */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-audiowide tracking-wider text-lg">
                Weekly Commitments
              </h2>
              <span className="text-xs text-gray-400 font-light">
                Squad “contracts”
              </span>
            </div>

            <form onSubmit={addCommit} className="flex gap-2 mb-4">
              <select
                value={newCommit.memberId}
                onChange={(e) =>
                  setNewCommit((s) => ({ ...s, memberId: e.target.value }))
                }
                className={`rounded-lg px-3 py-2 text-sm flex-1 ${BACKGROUND_COLOR} ${BORDER_COLOR} border`}
              >
                {MEMBERS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
              <input
                value={newCommit.text}
                onChange={(e) =>
                  setNewCommit((s) => ({ ...s, text: e.target.value }))
                }
                className={`rounded-lg px-3 py-2 text-sm flex-[2] ${BACKGROUND_COLOR} ${BORDER_COLOR} border`}
                placeholder="e.g., Apply to 3 roles"
              />
              <button className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-sm font-semibold transition">
                Add
              </button>
            </form>

            <ul className="space-y-2">
              {commitments.map((c) => (
                <li
                  key={c.id}
                  className={`flex items-center justify-between rounded-lg ${BACKGROUND_COLOR} ${BORDER_COLOR} border p-3`}
                >
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={c.done}
                      onChange={() => toggleCommit(c.id)}
                      className="h-4 w-4 accent-blue-600"
                    />
                    <span
                      className={`text-sm ${
                        c.done ? "line-through text-gray-500" : ""
                      }`}
                    >
                      {MEMBERS.find((m) => m.id === c.memberId)?.name}: {c.text}
                    </span>
                  </label>
                  <button
                    onClick={() => removeCommit(c.id)}
                    className={`text-xs px-2 py-1 rounded-lg ${FEATURE_BG} ${BORDER_COLOR} border hover:border-red-500 transition`}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </Card>

          {/* Nudge Center */}
          <Card>
            <h2 className="font-audiowide tracking-wider text-lg mb-4">
              Nudge Center
            </h2>
            <p className="text-xs text-gray-400 mb-3">
              Auto-detects inactivity
            </p>

            <ul className="space-y-2 text-sm">
              {MEMBERS.map((m) => {
                const inactive = isInactive(m.lastDays);
                return (
                  <li
                    key={m.id}
                    className={`flex items-center justify-between rounded-lg ${BACKGROUND_COLOR} ${BORDER_COLOR} border p-3`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          inactive ? "bg-red-500" : "bg-green-500"
                        }`}
                      />
                      <div>
                        <div className="font-semibold">{m.name}</div>
                        <div className="text-gray-400 text-xs">
                          Last: {m.lastDays}d · Focus: {m.focus}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemind(m)}
                      disabled={!inactive}
                      className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
                        inactive
                          ? "bg-blue-600 hover:bg-blue-500 text-white"
                          : `${FEATURE_BG} ${BORDER_COLOR} border text-gray-400 cursor-not-allowed`
                      }`}
                    >
                      Remind
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Recent reminders list (read-only) */}
            {recentReminders.length > 0 && (
              <div className="mt-4">
                <h3 className="text-xs uppercase tracking-wider text-gray-400 mb-2">
                  Recent reminders
                </h3>
                <ul className="text-xs text-gray-400 space-y-1">
                  {recentReminders.map((r) => (
                    <li key={r.id}>
                      {r.name} · <span className="text-gray-500">{r.when}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
        </section>

        {/* Rituals & Resources */}
        <section className="grid lg:grid-cols-3 gap-6">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-audiowide tracking-wider text-lg">
                Squad Rituals
              </h2>
              <span className="text-xs text-gray-400">{squad.name}</span>
            </div>
            <ul className="space-y-2 text-sm">
              {RITUALS.map((r) => (
                <li
                  key={r.id}
                  className={`flex items-center justify-between rounded-lg ${BACKGROUND_COLOR} ${BORDER_COLOR} border p-3`}
                >
                  <div>
                    <div className="font-semibold">{r.title}</div>
                    <div className="text-gray-400">{r.when}</div>
                  </div>
                  <button
                    className={`text-xs px-2 py-1 rounded-lg ${FEATURE_BG} ${BORDER_COLOR} border hover:border-blue-500 transition`}
                  >
                    Notify Squad
                  </button>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-audiowide tracking-wider text-lg">
                Pinned Resources
              </h2>
              <button
                onClick={addPin}
                className="text-xs px-2 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 font-semibold transition"
              >
                Add
              </button>
            </div>
            <ul className="text-sm space-y-2">
              {pins.map((r) => (
                <li
                  key={r.id}
                  className={`group flex items-center justify-between rounded-lg ${BACKGROUND_COLOR} ${BORDER_COLOR} border p-3 hover:border-blue-500/60 transition`}
                >
                  <a
                    href={r.url}
                    className="text-blue-400 underline group-hover:text-blue-300"
                  >
                    {r.title}
                  </a>
                  <span className="text-gray-500 font-light">by {r.by}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <h2 className="font-audiowide tracking-wider text-lg mb-4">
              Templates
            </h2>
            <ul className="space-y-2 text-sm">
              {[
                "Weekly plan: Apps + DSA + Mock",
                "Post-mock debrief checklist",
                "Application tracker CSV",
              ].map((t) => (
                <li
                  key={t}
                  className={`flex items-center justify-between rounded-lg ${BACKGROUND_COLOR} ${BORDER_COLOR} border p-3`}
                >
                  <span>{t}</span>
                  <button
                    className={`text-xs px-2 py-1 rounded-lg ${FEATURE_BG} ${BORDER_COLOR} border hover:border-blue-500 transition`}
                  >
                    Use
                  </button>
                </li>
              ))}
            </ul>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function Card({ children }) {
  return (
    <section
      className={`rounded-2xl ${FEATURE_BG} ${BORDER_COLOR} border p-5 shadow-xl shadow-black/20`}
    >
      {children}
    </section>
  );
}
