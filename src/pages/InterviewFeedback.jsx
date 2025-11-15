// src/pages/InterviewFeedback.jsx
import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import LoggedInNavBar from "../components/nav/LoggedInNavBar.jsx";
import Footer from "../components/Footer.jsx";
import {
  BACKGROUND_COLOR,
  FEATURE_BG,
  BORDER_COLOR,
  ACCENT_GRADIENT,
  GridOverlay,
} from "../utils/constants";

/* ---------- Small UI helpers (styled to match system) ---------- */
function FieldLabel({ children, hint }) {
  return (
    <div>
      <h3 className="text-base font-semibold mb-1">{children}</h3>
      {hint ? <p className="text-xs text-gray-400">{hint}</p> : null}
    </div>
  );
}

function Card({ children, className = "" }) {
  return (
    <section
      className={`${FEATURE_BG} ${BORDER_COLOR} border rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl ${className}`}
    >
      {children}
    </section>
  );
}

function RatingRow({ idPrefix, label, hint }) {
  return (
    <Card className="p-6 md:p-8">
      <div className="grid gap-6 md:grid-cols-[260px,1fr]">
        <FieldLabel hint={hint}>{label}</FieldLabel>

        <div className="space-y-4">
          <div className="grid sm:grid-cols-[180px,1fr] gap-3 sm:gap-4 items-center">
            <label
              htmlFor={`${idPrefix}-rating`}
              className="text-sm text-gray-400"
            >
              Rating (0–5)
            </label>
            <input
              id={`${idPrefix}-rating`}
              type="number"
              min={0}
              max={5}
              step="0.5"
              placeholder="e.g., 4.5"
              className={`h-12 w-full sm:w-48 rounded-xl px-4 text-base outline-none
                          focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/60
                          ${BACKGROUND_COLOR} ${BORDER_COLOR} border`}
            />
          </div>

          <div className="grid gap-2">
            <label
              htmlFor={`${idPrefix}-notes`}
              className="text-sm text-gray-400"
            >
              Notes
            </label>
            <textarea
              id={`${idPrefix}-notes`}
              placeholder="What stood out? Strengths, gaps, examples…"
              className={`min-h-[140px] md:min-h-[170px] rounded-xl px-4 py-3 text-base outline-none resize-y
                          focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/60
                          ${BACKGROUND_COLOR} ${BORDER_COLOR} border`}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ---------- Page ---------- */
export default function InterviewFeedback() {
  const location = useLocation();
  const now = useMemo(() => new Date().toLocaleString(), []);
  const sessionId = location.state?.room || "FMYB6P";
  const questions = location.state?.askedQuestions?.join(", ") || "q1";
  const aiSummary = location.state?.summary;

  return (
    <div
      className={`min-h-screen ${BACKGROUND_COLOR} text-white relative overflow-hidden font-quicksand`}
    >
      <GridOverlay />
      <LoggedInNavBar />

      {/* Centered Gradient Hero */}
      <section className="relative mb-10 text-center">
        <div
          className={`absolute inset-0 pointer-events-none opacity-20 ${ACCENT_GRADIENT}`}
        />
        <div className="relative max-w-7xl mx-auto px-6 pt-10 pb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-audiowide mb-1">
            Interview Feedback
          </h1>
          <p className="text-gray-300">
            Log structured notes and ratings to share with your squad.
          </p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 pb-12 space-y-6 md:space-y-8 relative z-10">
        {/* Header Card */}
        <Card className="p-6 md:p-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl md:text-2xl font-semibold">
              Session Details
            </h2>
            <p className="text-sm text-gray-400">
              Session{" "}
              <span className="font-mono tracking-wide text-white">
                {sessionId}
              </span>{" "}
              • {now}
            </p>
            <p className="text-sm text-gray-400">
              Questions asked: {questions}
            </p>
          </div>
        </Card>

        {/* AI Summary Card */}
        {aiSummary && (
          <Card className="p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-semibold mb-4">
              AI Interview Summary
            </h2>
            <div className={`rounded-xl p-4 ${BACKGROUND_COLOR} ${BORDER_COLOR} border`}>
              <p className="text-sm text-gray-300 whitespace-pre-wrap">
                {aiSummary}
              </p>
            </div>
          </Card>
        )}

        {/* Sections */}
        <RatingRow
          idPrefix="tech"
          label="Technical Competence"
          hint="Code quality, API/DSA knowledge, correctness, complexity understanding."
        />
        <RatingRow
          idPrefix="comm"
          label="Communication"
          hint="Clarity, structure (e.g., STAR), collaboration, explaining tradeoffs."
        />
        <RatingRow
          idPrefix="ps"
          label="Problem-Solving Approach"
          hint="Clarifying questions, test strategy, decomposition, incremental reasoning."
        />
        <RatingRow
          idPrefix="culture"
          label="Team Fit / Professionalism"
          hint="Ownership, curiosity, feedback receptiveness, alignment with team values."
        />

        {/* Submit bar */}
        <div className="sticky bottom-4 flex justify-end">
          <div
            className={`inline-flex gap-3 rounded-xl px-3 py-3 shadow-lg ${FEATURE_BG} ${BORDER_COLOR} border`}
          >
            <button
              type="button"
              className={`px-4 h-11 rounded-lg text-sm ${FEATURE_BG} ${BORDER_COLOR} border hover:border-cyan-500/60 transition`}
              onClick={() => window.history.back()}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-5 h-11 rounded-lg text-sm font-semibold shadow hover:brightness-110 ${ACCENT_GRADIENT}`}
            >
              Save Feedback
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
