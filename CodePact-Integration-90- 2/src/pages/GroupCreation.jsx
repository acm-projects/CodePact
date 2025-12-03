// src/pages/GroupCreation.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import LoggedInNavbar from "../components/nav/LoggedInNavBar";

import {
  BACKGROUND_COLOR,
  FEATURE_BG,
  BORDER_COLOR,
  ACCENT_GRADIENT,
  GridOverlay,
} from "../utils/constants";

export default function GroupCreation() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("Create");
  const [squadName, setSquadName] = useState("");
  const [joinCode, setJoinCode] = useState("");

  const changeTab = (tab) => {
    setActiveTab(tab);
  };

  // ================================================================
  // CREATE NEW SQUAD (conversation)
  // ================================================================
  const handleCreateSquad = async (e) => {
    e.preventDefault();

    if (!squadName.trim()) {
      alert("Please enter a squad name.");
      return;
    }

    try {
      console.log("🟦 [CREATE SQUAD] Sending request...");

      const response = await fetch("http://localhost:3000/api/dev/seed-conv", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: squadName }),
      });

      const data = await response.json();
      console.log("🟦 [CREATE SQUAD] Response:", data);

      if (data.success) {
        alert(`🎉 Squad "${squadName}" created!`);
        navigate("/messages"); // Redirect to messages (squad list)
      } else {
        alert("Could not create squad.");
      }
    } catch (err) {
      console.error("❌ [CREATE SQUAD ERROR]", err);
      alert("Error creating squad. Please try again.");
    }
  };

  // ================================================================
  // JOIN EXISTING SQUAD BY CODE
  // ================================================================
  const handleJoinSquad = async (e) => {
    e.preventDefault();

    if (!joinCode.trim()) {
      alert("Enter a squad code.");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:3000/api/findCodeGroup?code=${encodeURIComponent(
          joinCode.trim()
        )}`,
        {
          credentials: "include",
        }
      );

      const data = await res.json();
      console.log("🟧 [JOIN SQUAD RESPONSE]", data);

      if (!data.success) {
        alert("Invalid squad code.");
        return;
      }

      alert("Joined squad successfully!");
      navigate("/messages");
    } catch (err) {
      console.error("❌ [JOIN SQUAD ERROR]", err);
      alert("Error joining squad.");
    }
  };

  // ================================================================
  // UI RETURN
  // ================================================================
  return (
    <div
      className={`min-h-screen relative ${BACKGROUND_COLOR} text-white font-quicksand`}
    >
      <GridOverlay />
      <LoggedInNavbar />

      <main className="max-w-5xl mx-auto px-6 py-10 text-center relative z-10">
        <h1 className="text-3xl font-audiowide mb-4">
          START YOUR{" "}
          <span className={`bg-clip-text text-transparent ${ACCENT_GRADIENT}`}>
            COLLABORATION
          </span>
        </h1>

        <p className="text-gray-400 mb-10">
          Create a new squad or join an existing one.
        </p>

        {/* Create / Join Tabs */}
        <div className="flex justify-center space-x-6 mb-8">
          <button
            onClick={() => changeTab("Create")}
            className={`px-4 py-2 font-semibold border-b-2 ${
              activeTab === "Create"
                ? "text-cyan-400 border-cyan-400"
                : "text-gray-400 border-transparent"
            }`}
          >
            Create a Squad
          </button>

          <button
            onClick={() => changeTab("Join")}
            className={`px-4 py-2 font-semibold border-b-2 ${
              activeTab === "Join"
                ? "text-fuchsia-400 border-fuchsia-400"
                : "text-gray-400 border-transparent"
            }`}
          >
            Join a Squad
          </button>
        </div>

        {/* Create / Join Card */}
        <div
          className={`${FEATURE_BG} ${BORDER_COLOR} border rounded-2xl max-w-md mx-auto p-8 text-left shadow-xl`}
        >
          {/* ====================== CREATE ====================== */}
          {activeTab === "Create" && (
            <>
              <h2 className="text-xl font-bold mb-6">Create a Squad</h2>

              <form onSubmit={handleCreateSquad} className="space-y-5">
                <div>
                  <label className="text-sm text-gray-400">Squad Name</label>
                  <input
                    type="text"
                    value={squadName}
                    onChange={(e) => setSquadName(e.target.value)}
                    placeholder="e.g., The Algorithm Avengers"
                    className={`${FEATURE_BG} border ${BORDER_COLOR} rounded-lg w-full px-4 py-3 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400`}
                  />
                </div>

                <button
                  type="submit"
                  className={`${ACCENT_GRADIENT} w-full py-3 rounded-lg font-semibold`}
                >
                  Create Squad
                </button>
              </form>
            </>
          )}

          {/* ====================== JOIN ====================== */}
          {activeTab === "Join" && (
            <>
              <h2 className="text-xl font-bold mb-6">Join a Squad</h2>

              <form onSubmit={handleJoinSquad} className="space-y-5">
                <div>
                  <label className="text-sm text-gray-400">
                    Squad Code or Link
                  </label>
                  <input
                    type="text"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    placeholder="Enter squad code..."
                    className={`${FEATURE_BG} border ${BORDER_COLOR} rounded-lg w-full px-4 py-3 focus:border-fuchsia-400 focus:ring-1 focus:ring-fuchsia-400`}
                  />
                </div>

                <button
                  type="submit"
                  className={`${ACCENT_GRADIENT} w-full py-3 rounded-lg font-semibold`}
                >
                  Join Squad
                </button>
              </form>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
