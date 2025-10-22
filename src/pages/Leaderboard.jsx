import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { BACKGROUND_COLOR, ACCENT_GRADIENT, FEATURE_BG, BORDER_COLOR, GridOverlay } from "../utils/constants";

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
    else if (tab === "Squads") navigate("/group-chat");
    else if (tab === "Public Forum") navigate("/public-forum");
  };

  return (
    <div className={`min-h-screen relative ${BACKGROUND_COLOR} text-white font-quicksand`}>
      {/* Grid overlay and neon glows */}
      <GridOverlay />
      <div className="absolute top-[-20rem] left-1/4 w-[60rem] h-[60rem] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-20rem] right-1/3 w-[60rem] h-[60rem] bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <header className="relative z-10 bg-transparent border-b border-gray-800 py-4 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className={`w-9 h-9 ${ACCENT_GRADIENT} rounded-lg flex items-center justify-center shadow-lg`}>
                <span className="font-bold text-white text-sm">CP</span>
              </div>
              <span className="font-bold text-xl text-white">CodePact</span>
            </div>

            {/* User Info */}
            <div className="flex flex-col items-end space-y-2">
              <div className="flex items-center space-x-3">
                <span className="text-white font-medium">Name</span>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center border-2 border-cyan-400">
                  <span className="text-white font-bold text-sm">👤</span>
                </div>
              </div>
              <button className={`${ACCENT_GRADIENT} text-white font-semibold px-4 py-1 rounded-lg transition-all duration-200 text-sm shadow-md hover:brightness-110`}>
                Squad Creation
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center border-b border-gray-700 pb-2">
            <div className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabClick(tab)}
                  className={`relative font-medium transition-colors duration-200 pb-2 border-b-2 ${
                    activeTab === tab
                      ? `text-white border-transparent after:absolute after:-bottom-1 after:left-0 after:w-full after:h-1 after:rounded-full ${ACCENT_GRADIENT}`
                      : "text-gray-400 hover:text-white border-transparent"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      
      

        {/* Leaderboard Title Section */}
      <main className="max-w-6xl mx-auto px-6 py-8 relative z-10">

<div className="mb-8 text-center">
  <h1 className="text-2xl font-bold mb-2 text-white">Name</h1>
  <h2 className="text-4xl font-audiowide mb-4">
    <span className={`bg-clip-text text-transparent ${ACCENT_GRADIENT}`}>
      LEADERBOARD & PROGRESS
    </span>
  </h2>
  <p className="text-gray-400">
    Track your squad's performance and your progress
  </p>
</div>


        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Your Squad Points", value: 123 },
            { label: "Problems Solved", value: 3900 },
            { label: "Applications Sent", value: 45 },
            { label: "Leetcode Problems Solved", value: 120 },
          ].map((stat, i) => (
            <div
              key={i}
              className={`${FEATURE_BG} ${BORDER_COLOR} border rounded-xl p-6 text-center shadow-lg hover:shadow-cyan-500/10 transition-shadow duration-200`}
            >
              <div className={`text-2xl font-bold bg-clip-text text-transparent ${ACCENT_GRADIENT} mb-2`}>
                {stat.value.toLocaleString()}
              </div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Squad Leaderboard */}
        <div className={`${FEATURE_BG} ${BORDER_COLOR} border rounded-2xl p-8 mb-8 shadow-2xl shadow-fuchsia-900/40`}>
          <h3 className={`text-2xl font-bold mb-6 ${ACCENT_GRADIENT}`}>Squad Leaderboard</h3>
          <div className="space-y-4">
            <LeaderboardEntry rank={1} name="Algorithm Avengers" points="5,500 pts" color="yellow-500" />
            <LeaderboardEntry rank={2} name="The Code Crushers" points="4,950 pts" color="gray-400" />
            <LeaderboardEntry rank={3} name="Your Squad" points="3,900 pts" color="fuchsia-500" highlight />
            <LeaderboardEntry rank={4} name="Binary Builders" points="3,200 pts" color="gray-400" />
            <LeaderboardEntry rank={5} name="Debug Dynasty" points="2,800 pts" color="gray-400" />
          </div>
        </div>

        {/* Progress & Activity */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className={`${FEATURE_BG} ${BORDER_COLOR} border rounded-2xl p-6 shadow-lg`}>
            <h4 className={`text-xl font-bold mb-4 ${ACCENT_GRADIENT}`}>Weekly Progress</h4>
            <ProgressBar label="Problems Solved" value={24} max={30} color="cyan" />
            <ProgressBar label="Applications Sent" value={8} max={10} color="fuchsia" />
          </div>

          <div className={`${FEATURE_BG} ${BORDER_COLOR} border rounded-2xl p-6 shadow-lg`}>
            <h4 className={`text-xl font-bold mb-4 ${ACCENT_GRADIENT}`}>Recent Activity</h4>
            <div className="space-y-3 text-gray-400 text-sm">
              <div>• John solved "Two Sum"</div>
              <div>• Sarah applied to Google</div>
              <div>• Mike completed mock interview</div>
              <div>• Your squad gained 200 points</div>
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
  return (
    <div
      className={`flex items-center justify-between border rounded-xl p-4 transition-colors duration-200 ${
        highlight
          ? `border-cyan-400 hover:border-fuchsia-400 ${FEATURE_BG} shadow-lg`
          : `${BORDER_COLOR} hover:border-cyan-400 ${FEATURE_BG}`
      }`}
    >
      <div className="flex items-center space-x-4">
        <div className={`w-8 h-8 bg-${color} rounded-full flex items-center justify-center text-black font-bold`}>
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
        <span className="text-white font-semibold text-sm">{value}/{max}</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div className={`${colorClass} h-2 rounded-full`} style={{ width: `${percent}%` }}></div>
      </div>
    </div>
  );
}
