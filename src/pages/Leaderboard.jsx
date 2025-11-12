// src/pages/Leaderboard.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import {
  BACKGROUND_COLOR,
  ACCENT_GRADIENT,
  FEATURE_BG,
  BORDER_COLOR,
  GridOverlay,
} from "../utils/constants";

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState("Home");
  const navigate = useNavigate();

  const tabs = [
    "Home",
    "Squads",
    "Public Forum",
    "Messages",
    "AI Interviewer",
    "Reminders & Notifications",
  ];

  // Route map for cleaner navigation logic
  const routeForTab = {
    Home: "/leaderboard",
    Squads: "/group-chat",
    Messages: "/group-chat", //  Messages goes to Group Chat
    "Public Forum": "/public-forum",
    "AI Interviewer": "/ai-interviewer",
    "Reminders & Notifications": "/reminders",
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    const path = routeForTab[tab];
    if (path) navigate(path);
  };

  return (
    <div className={`min-h-screen relative ${BACKGROUND_COLOR} text-white font-quicksand`}>
      {/* Grid overlay */}
      <GridOverlay />

      {/* Header */}
      <header className="relative z-10 bg-transparent py-8 px-0">
        <div className="max-w-7xl mx-auto px-8">
          {/* Top Row */}
          <div className="flex justify-between items-center mb-6 relative">
            <div className="flex items-center space-x-3">
              <div className={`w-9 h-9 ${ACCENT_GRADIENT} rounded-lg flex items-center justify-center`}>
                <span className="font-bold text-white text-sm">CP</span>
              </div>
              <span className="text-xl font-audiowide text-white">CODEPACT</span>
            </div>

            {/* Profile Icon */}
            <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center border-2 border-white">
              <span className={`font-bold text-sm bg-clip-text text-transparent ${ACCENT_GRADIENT}`}>👤</span>
            </div>

            {/* Divider below logo/profile */}
            <div className="absolute bottom-[-12px] left-0 w-full h-[2px] bg-gray-700 opacity-50"></div>
          </div>

          {/* Tabs Row */}
          <div className="flex justify-between items-center mt-8 mb-6 relative">
            <div className="flex space-x-6">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabClick(tab)}
                  className={`relative font-medium transition-colors duration-200 pb-2 border-b-2 ${
                    activeTab === tab
                      ? "text-white border-b-cyan-400"
                      : "text-gray-400 hover:text-white border-transparent"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <button
              className={`${ACCENT_GRADIENT} text-white font-semibold px-4 py-1 rounded-lg transition-all duration-200 text-sm shadow-md hover:brightness-110`}
            >
              Squad Creation
            </button>

            {/* Divider below tabs */}
            <div className="absolute bottom-[-12px] left-0 w-full h-[2px] bg-gray-700 opacity-70"></div>
          </div>
        </div>
      </header>

      {/* Leaderboard Section */}
      <main className="max-w-6xl mx-auto px-6 py-4 relative z-10">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold mb-2 text-white">Welcome, Nabiha!</h1>
          <h2 className="text-4xl font-audiowide mb-4">
            <span>LEADERBOARD & </span>
            <span className={`bg-clip-text text-transparent ${ACCENT_GRADIENT}`}>PROGRESS</span>
          </h2>
          <p className="text-gray-400">Track your squad's performance and your progress</p>
        </div>

        {/* Stats Grid with subtle pops of color */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Your Squad Points", value: 123, color: "text-rose-400" },
            { label: "Problems Solved", value: 3900, color: "text-lime-400" },
            { label: "Applications Sent", value: 45, color: "text-orange-400" },
            { label: "Leetcode Problems Solved", value: 120, color: "text-sky-400" },
          ].map((stat, i) => (
            <div
              key={i}
              className={`${FEATURE_BG} ${BORDER_COLOR} border rounded-xl p-6 text-center shadow-lg hover:shadow-cyan-500/10 transition-shadow duration-200`}
            >
              <div className={`text-2xl font-bold mb-2 ${stat.color}`}>
                {stat.value.toLocaleString()}
              </div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Squad Leaderboard */}
        <div className={`${FEATURE_BG} ${BORDER_COLOR} border rounded-2xl p-8 mb-8 shadow-2xl shadow-fuchsia-900/40`}>
          <h3 className="text-2xl font-bold mb-6 text-white">Squad Leaderboard</h3>
          <div className="space-y-4">
            <LeaderboardEntry rank={1} name="Algorithm Avengers" points="5,500 pts" color="yellow-400" />
            <LeaderboardEntry rank={2} name="The Code Crushers" points="4,950 pts" color="gray-400" />
            <LeaderboardEntry rank={3} name="Your Squad" points="3,900 pts" color="fuchsia-400" highlight />
            <LeaderboardEntry rank={4} name="Binary Builders" points="3,200 pts" color="gray-400" />
            <LeaderboardEntry rank={5} name="Debug Dynasty" points="2,800 pts" color="gray-400" />
          </div>
        </div>

        {/* Progress & Activity */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className={`${FEATURE_BG} ${BORDER_COLOR} border rounded-2xl p-6 shadow-lg`}>
            <h4 className="text-xl font-bold mb-4 text-white">Weekly Progress</h4>
            <ProgressBar label="Problems Solved" value={24} max={30} color="cyan" />
            <ProgressBar label="Applications Sent" value={8} max={10} color="fuchsia" />
          </div>

          <div className={`${FEATURE_BG} ${BORDER_COLOR} border rounded-2xl p-6 shadow-lg`}>
            <h4 className="text-xl font-bold mb-4 text-white">Recent Activity</h4>
            <div className="space-y-3 text-sm">
              <div className="text-cyan-400">• John solved "Two Sum"</div>
              <div className="text-fuchsia-400">• Sarah applied to Google</div>
              <div className="text-lime-400">• Mike completed mock interview</div>
              <div className="text-yellow-400">• Your squad gained 200 points</div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// --- Subcomponents ---
function LeaderboardEntry({ rank, name, points, color, highlight = false }) {
  // Rank circle colors
  let rankColor;
  switch (rank) {
    case 1:
      rankColor = "bg-yellow-400"; // Gold
      break;
    case 2:
      rankColor = "bg-gray-400"; // Silver
      break;
    case 3:
      rankColor = "bg-fuchsia-400"; // Bronze/Pink
      break;
    case 4:
      rankColor = "bg-lime-400"; // Green
      break;
    case 5:
      rankColor = "bg-orange-400"; // Orange
      break;
    default:
      rankColor = "bg-cyan-400"; // Default pop color
  }

  return (
    <div
      className={`flex items-center justify-between border rounded-xl p-4 transition-colors duration-200 ${
        highlight
          ? `border-cyan-400 hover:border-fuchsia-400 ${FEATURE_BG} shadow-lg`
          : `${BORDER_COLOR} hover:border-cyan-400 ${FEATURE_BG}`
      }`}
    >
      <div className="flex items-center space-x-4">
        {/* Rank Circle */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${rankColor} text-black font-bold`}>
          {rank}
        </div>

        <div>
          <div className="font-semibold text-white">{name}</div>
        </div>
      </div>
      <div className={`font-semibold ${highlight ? "text-cyan-400" : "text-gray-300"}`}>{points}</div>
    </div>
  );
}

function ProgressBar({ label, value, max, color }) {
  const percent = (value / max) * 100;
  const colorClass = color === "cyan" ? "bg-cyan-500" : "bg-fuchsia-500";

  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-gray-400 text-sm">{label}</span>
        <span className="text-white font-semibold text-sm">
          {value}/{max}
        </span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div className={`${colorClass} h-2 rounded-full`} style={{ width: `${percent}%` }}></div>
      </div>
    </div>
  );
}
