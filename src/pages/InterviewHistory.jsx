import React, { useEffect, useState } from "react";
import LoggedInNavBar from "../components/nav/LoggedInNavbar.jsx";
import Footer from "../components/Footer.jsx";

const STORAGE_KEY = "cp_interview_history_v1";

export default function InterviewHistory() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setItems(raw ? JSON.parse(raw) : []);
    } catch {
      setItems([]);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0f23] text-white grid grid-rows-[auto_1fr]">
      <LoggedInNavBar />
      <main className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">My Interview History</h1>

        {!items.length ? (
          <div className="bg-[#0c123a] border border-[#1a214b] rounded-2xl p-6 text-[#a9b0d0]">
            No interviews logged yet.
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((it, idx) => (
              <article
                key={idx}
                className="bg-[#0c123a] border border-[#1a214b] rounded-2xl p-5"
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm text-[#a9b0d0]">
                    Room <span className="font-mono text-white">{it.room}</span>{" "}
                    • {new Date(it.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="mt-3 text-sm">
                  <p className="text-[#a9b0d0]">
                    Questions asked:{" "}
                    {it.askedQuestions?.length
                      ? it.askedQuestions.join(", ")
                      : "—"}
                  </p>
                </div>

                <div className="mt-4 grid md:grid-cols-3 gap-3 text-sm">
                  <div className="bg-black/20 rounded-xl p-3">
                    <p className="font-semibold mb-1">Technical</p>
                    <p className="text-[#a9b0d0]">
                      Rating: {it.rubric?.technical?.rating ?? "—"}
                    </p>
                    <p className="text-[#a9b0d0] mt-1 whitespace-pre-wrap">
                      {it.rubric?.technical?.notes || ""}
                    </p>
                  </div>
                  <div className="bg-black/20 rounded-xl p-3">
                    <p className="font-semibold mb-1">Communication</p>
                    <p className="text-[#a9b0d0]">
                      Rating: {it.rubric?.communication?.rating ?? "—"}
                    </p>
                    <p className="text-[#a9b0d0] mt-1 whitespace-pre-wrap">
                      {it.rubric?.communication?.notes || ""}
                    </p>
                  </div>
                  <div className="bg-black/20 rounded-xl p-3">
                    <p className="font-semibold mb-1">Problem-Solving</p>
                    <p className="text-[#a9b0d0]">
                      Rating: {it.rubric?.problemSolving?.rating ?? "—"}
                    </p>
                    <p className="text-[#a9b0d0] mt-1 whitespace-pre-wrap">
                      {it.rubric?.problemSolving?.notes || ""}
                    </p>
                  </div>
                </div>

                {it.overallNotes ? (
                  <div className="mt-3 bg-black/20 rounded-xl p-3 text-sm">
                    <p className="font-semibold mb-1">Overall Notes</p>
                    <p className="text-[#a9b0d0] whitespace-pre-wrap">
                      {it.overallNotes}
                    </p>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
