import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import LoggedInNavbar from "../components/nav/LoggedInNavBar";
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

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === "Home") navigate("/leaderboard");
    else if (tab === "Squads") navigate("/squads");
    else if (tab === "Public Forum") navigate("/public-forum");
    else if (tab === "Messages") navigate("/messages");
    else if (tab === "AI Interviewer") navigate("/interview");
    else if (tab === "Reminders & Notifications") navigate("/notifications");
  };

  const stats = [
    { label: "Your Squad Points", value: 123, color: "text-rose-400" },
    { label: "Mock Interviews Completed", value: 3900, color: "text-lime-400" },
    { label: "Applications Sent", value: 45, color: "text-orange-400" },
    { label: "Leetcode Problems Solved", value: 120, color: "text-sky-400" },
  ];

  return (
    <div className={`min-h-screen ${BACKGROUND_COLOR} text-white`}>
      <LoggedInNavbar />
      <GridOverlay />

      {/*  Gradient Band added here */}
      <section className="relative">
        <div
          className={`absolute inset-0 pointer-events-none opacity-20 ${ACCENT_GRADIENT}`}
        />
        <div className="relative max-w-6xl mx-auto px-6 pt-8 pb-2 text-center">
          <h1 className="text-2xl font-bold mb-2 text-white">
            Welcome, Nabiha!
          </h1>
          <h2 className="text-4xl font-audiowide mb-4">
            <span>LEADERBOARD & </span>
            <span
              className={`bg-clip-text text-transparent ${ACCENT_GRADIENT}`}
            >
              PROGRESS
            </span>
          </h2>
          <p className="text-gray-400">
            Track your squad&rsquo;s performance and your progress
          </p>
        </div>
      </section>
      {/* ✅ End gradient section */}

      {/* Rest of your code untouched */}
      <main className="max-w-6xl mx-auto px-6 py-10 relative z-10">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
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
        <div
          className={`${FEATURE_BG} ${BORDER_COLOR} border rounded-2xl p-8 mb-8 shadow-2xl shadow-fuchsia-900/40`}
        >
          <h3 className="text-2xl font-bold mb-6 text-white">
            Squad Leaderboard
          </h3>
          <div className="space-y-4">
            <LeaderboardEntry
              rank={1}
              name="Algorithm Avengers"
              points="5,500 pts"
              color="yellow-400"
            />
            <LeaderboardEntry
              rank={2}
              name="The Code Crushers"
              points="4,950 pts"
              color="gray-400"
            />
            <LeaderboardEntry
              rank={3}
              name="Your Squad"
              points="3,900 pts"
              color="fuchsia-400"
              highlight
            />
            <LeaderboardEntry
              rank={4}
              name="Binary Builders"
              points="3,200 pts"
              color="gray-400"
            />
            <LeaderboardEntry
              rank={5}
              name="Debug Dynasty"
              points="2,800 pts"
              color="gray-400"
            />
          </div>
        </div>

        {/* Progress & Activity */}
        <div className="grid md:grid-cols-2 gap-8">
          <div
            className={`${FEATURE_BG} ${BORDER_COLOR} border rounded-2xl p-6 shadow-lg`}
          >
            <h4 className="text-xl font-bold mb-4 text-white">
              Weekly Progress
            </h4>
            <ProgressBar
              label="Problems Solved"
              value={24}
              max={30}
              color="cyan"
            />
            <ProgressBar
              label="Applications Sent"
              value={8}
              max={10}
              color="fuchsia"
            />
          </div>
          <div
            className={`${FEATURE_BG} ${BORDER_COLOR} border rounded-2xl p-6 shadow-lg`}
          >
            <h4 className="text-xl font-bold mb-4 text-white">
              Recent Activity
            </h4>
            <div className="space-y-3 text-sm">
              <div className="text-cyan-400">• John solved "Two Sum"</div>
              <div className="text-fuchsia-400">• Sarah applied to Google</div>
              <div className="text-lime-400">
                • Mike completed mock interview
              </div>
              <div className="text-yellow-400">
                • Your squad gained 200 points
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </main>
    </div>
  );
}

/* ---------- Subcomponents ---------- */
function LeaderboardEntry({ rank, name, points, color, highlight = false }) {
  let rankColor;
  switch (rank) {
    case 1:
      rankColor = "bg-yellow-400";
      break;
    case 2:
      rankColor = "bg-gray-400";
      break;
    case 3:
      rankColor = "bg-fuchsia-400";
      break;
    case 4:
      rankColor = "bg-lime-400";
      break;
    case 5:
      rankColor = "bg-orange-400";
      break;
    default:
      rankColor = "bg-cyan-400";
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
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${rankColor} text-black font-bold`}
        >
          {rank}
        </div>
        <div className="font-semibold text-white">{name}</div>
      </div>
      <div
        className={`font-semibold ${
          highlight ? "text-cyan-400" : "text-gray-300"
        }`}
      >
        {points}
      </div>
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
        <div
          className={`${colorClass} h-2 rounded-full`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
