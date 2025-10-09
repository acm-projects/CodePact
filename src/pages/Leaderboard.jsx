import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState("Home");
  const navigate = useNavigate();

  const tabs = [
    "Home", "Squads", "Public Forum", "Messages", "AI Interviewer", "Reminders & Notifications",
  ];

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === "Home") {
      navigate("/leaderboard");
    } else if (tab === "Squads") {
      navigate("/group-chat");
    } else if (tab === "Public Forum") {
      navigate("/public-forum");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f23] text-white">
      {/* Custom Header for Leaderboard */}
      <header className="bg-[#0f0f23] border-b border-gray-800 py-4 px-8">
        <div className="max-w-7xl mx-auto">
          {/* Top Row - Logo and User Info */}
          <div className="flex justify-between items-center mb-6">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="font-bold text-white text-sm">CP</span>
              </div>
              <span className="font-bold text-xl text-white">CodePact</span>
            </div>

            {/* User Info and Squad Creation - Now stacked vertically */}
            <div className="flex flex-col items-end space-y-2">
              {/* User Name and Profile Picture */}
              <div className="flex items-center space-x-3">
                <span className="text-white font-medium">Name</span>
                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center border-2 border-blue-500">
                  <span className="text-white font-bold text-sm">👤</span>
                </div>
              </div>
              
              {/* Squad Creation Button - Now underneath profile */}
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-1 rounded-lg transition-colors duration-200 text-sm">
                Squad Creation
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center border-b border-gray-700 pb-2">
            {/* Main Tabs */}
            <div className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabClick(tab)}
                  className={`font-medium transition-colors duration-200 pb-2 border-b-2 ${
                    activeTab === tab
                      ? "text-blue-400 border-blue-400"
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

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Centered Leaderboard Title Section */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold mb-2">Name</h1>
          <h2 className="text-3xl font-bold text-white mb-4">Leaderboard & Progress</h2>
          <p className="text-gray-400">
            Track your squad's performance and your progress
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#1a1a2e] border border-gray-800 rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-white mb-2">123</div>
            <div className="text-gray-400 text-sm">Your Squad Points</div>
          </div>
          <div className="bg-[#1a1a2e] border border-gray-800 rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-white mb-2">3,900</div>
            <div className="text-gray-400 text-sm">Problems Solved</div>
          </div>
          <div className="bg-[#1a1a2e] border border-gray-800 rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-white mb-2">45</div>
            <div className="text-gray-400 text-sm">Applications Sent</div>
          </div>
          <div className="bg-[#1a1a2e] border border-gray-800 rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-white mb-2">120</div>
            <div className="text-gray-400 text-sm">Leetcode Problems Solved</div>
          </div>
        </div>

        {/* Squad Leaderboard */}
        <div className="bg-[#1a1a2e] border border-gray-800 rounded-2xl p-8">
          <h3 className="text-2xl font-bold mb-6 text-white">Squad Leaderboard</h3>
          
          <div className="space-y-4">
            {/* 1st Place */}
            <div className="flex items-center justify-between bg-[#0f0f23] border border-gray-700 rounded-xl p-4 hover:border-blue-500/50 transition-colors duration-200">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold">
                  1
                </div>
                <div>
                  <div className="font-semibold text-white">Algorithm Avengers</div>
                </div>
              </div>
              <div className="text-blue-400 font-semibold">5,500 pts</div>
            </div>

            {/* 2nd Place */}
            <div className="flex items-center justify-between bg-[#0f0f23] border border-gray-700 rounded-xl p-4 hover:border-blue-500/50 transition-colors duration-200">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-black font-bold">
                  2
                </div>
                <div>
                  <div className="font-semibold text-white">The Code Crushers</div>
                </div>
              </div>
              <div className="text-blue-400 font-semibold">4,950 pts</div>
            </div>

            {/* 3rd Place - Your Squad */}
            <div className="flex items-center justify-between bg-[#0f0f23] border border-blue-500 rounded-xl p-4 hover:border-blue-400 transition-colors duration-200">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-black font-bold">
                  3
                </div>
                <div>
                  <div className="font-semibold text-white">Your Squad</div>
                </div>
              </div>
              <div className="text-blue-400 font-semibold">3,900 pts</div>
            </div>

            {/* 4th Place */}
            <div className="flex items-center justify-between bg-[#0f0f23] border border-gray-700 rounded-xl p-4 hover:border-blue-500/50 transition-colors duration-200">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-[#1a1a2e] rounded-full flex items-center justify-center text-gray-400 font-bold">
                  4
                </div>
                <div>
                  <div className="font-semibold text-white">Binary Builders</div>
                </div>
              </div>
              <div className="text-gray-400 font-semibold">3,200 pts</div>
            </div>

            {/* 5th Place */}
            <div className="flex items-center justify-between bg-[#0f0f23] border border-gray-700 rounded-xl p-4 hover:border-blue-500/50 transition-colors duration-200">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-[#1a1a2e] rounded-full flex items-center justify-center text-gray-400 font-bold">
                  5
                </div>
                <div>
                  <div className="font-semibold text-white">Debug Dynasty</div>
                </div>
              </div>
              <div className="text-gray-400 font-semibold">2,800 pts</div>
            </div>
          </div>
        </div>

        {/* Additional Progress Section */}
        <div className="grid md:grid-cols-2 gap-8 mt-8">
          <div className="bg-[#1a1a2e] border border-gray-800 rounded-2xl p-6">
            <h4 className="text-xl font-bold mb-4 text-white">Weekly Progress</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Problems Solved</span>
                <span className="text-white font-semibold">24/30</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '80%' }}></div>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <span className="text-gray-400">Applications Sent</span>
                <span className="text-white font-semibold">8/10</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>
          </div>

          <div className="bg-[#1a1a2e] border border-gray-800 rounded-2xl p-6">
            <h4 className="text-xl font-bold mb-4 text-white">Recent Activity</h4>
            <div className="space-y-3">
              <div className="text-gray-400 text-sm">• John solved "Two Sum"</div>
              <div className="text-gray-400 text-sm">• Sarah applied to Google</div>
              <div className="text-gray-400 text-sm">• Mike completed mock interview</div>
              <div className="text-gray-400 text-sm">• Your squad gained 200 points</div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}