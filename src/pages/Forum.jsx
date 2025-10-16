import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import LoggedInNavbar from "../components/nav/LoggedInNavBar";

export default function PublicForum() {
  const [activeTab, setActiveTab] = useState("Public Forum");
  const navigate = useNavigate();

  const tabs = [
    "Home",
    "Squads",
    "Public Forum",
    "Messages",
    "AI Interviewer",
    "Reminders & Notifications",
  ];

  const discussions = [
    {
      category: "Interviewing",
      title:
        "How to counter-offer a lowball compensation package for Staff SWE?",
      replies: "25",
      views: "1.2k",
      lastAction: "2 hours ago by Janedoe",
      icon: "💼",
    },
    {
      category: "Technical",
      title: "Best explanation for the difference between 'map' and 'forEach'?",
      replies: "12",
      views: "4.0k",
      lastAction: "60 minutes ago by CodeMaster",
      icon: "💻",
    },
    {
      category: "Success",
      title: "[SUCCESS] My top 3 secrets for passing the ATS scan.",
      replies: "48",
      views: "2.8k",
      lastAction: "3 hours ago by John Smith",
      icon: "🎯",
    },
  ];

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === "Home") {
      navigate("/leaderboard");
    } else if (tab === "Squads") {
      navigate("/group-chat");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f23] text-white">
      {/* Custom Header */}
      <LoggedInNavbar />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Public Forum</h1>
          <p className="text-gray-400">
            Join discussions and share knowledge with the community
          </p>
        </div>

        <div className="grid grid-cols-4 gap-8">
          {/* Left Sidebar - Forum Categories */}
          <div className="col-span-1">
            <div className="bg-[#1a1a2e] border border-gray-800 rounded-2xl p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 text-white">
                Forum Categories
              </h2>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 mb-6">
                Start New Thread
              </button>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-300 mb-3">
                  Sections
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-[#0f0f23] rounded-lg hover:bg-blue-500/10 transition-colors duration-200">
                    <span className="text-white">Technical</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#0f0f23] rounded-lg hover:bg-blue-500/10 transition-colors duration-200">
                    <span className="text-white">Behavioral</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#0f0f23] rounded-lg hover:bg-blue-500/10 transition-colors duration-200">
                    <span className="text-white">Interviewing</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#0f0f23] rounded-lg hover:bg-blue-500/10 transition-colors duration-200">
                    <span className="text-white">Success</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Latest Discussions */}
          <div className="col-span-3">
            <div className="bg-[#1a1a2e] border border-gray-800 rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-6 text-white">
                Latest Discussions
              </h2>

              <div className="space-y-4">
                {discussions.map((discussion, index) => (
                  <div
                    key={index}
                    className="bg-[#0f0f23] border border-gray-700 rounded-xl p-6 hover:border-blue-500/50 transition-colors duration-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-grow">
                        <div className="text-2xl mt-1">{discussion.icon}</div>
                        <div className="flex-grow">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
                              {discussion.category}
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold text-white mb-3 hover:text-blue-400 cursor-pointer transition-colors duration-200">
                            {discussion.title}
                          </h3>
                          <div className="flex items-center space-x-6 text-sm text-gray-400">
                            <div className="flex items-center space-x-1">
                              <span>💬</span>
                              <span>{discussion.replies} replies</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span>👁️</span>
                              <span>{discussion.views} views</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span>🕒</span>
                              <span>Last action {discussion.lastAction}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors duration-200 text-sm whitespace-nowrap">
                        Join Discussion
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              <div className="text-center mt-8">
                <button className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200">
                  Load More Discussions
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
