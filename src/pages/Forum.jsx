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

export default function PublicForum() {
  const [activeTab, setActiveTab] = useState("Public Forum");
  const navigate = useNavigate();

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
    if (tab === "Home") navigate("/leaderboard");
    else if (tab === "Squads") navigate("/squads");
    else if (tab === "Public Forum") navigate("/public-forum");
    else if (tab === "Messages") navigate("/messages");
    else if (tab === "AI Interviewer") navigate("/interview");
    else if (tab === "Reminders & Notifications") navigate("/notifications");
  };

  return (
    <div
      className={`min-h-screen ${BACKGROUND_COLOR} text-white relative overflow-hidden font-quicksand`}
    >
      <GridOverlay />
      <LoggedInNavbar />

      {/* ✅ Centered Gradient Header */}
      <section className="relative mb-10 text-center">
        <div
          className={`absolute inset-0 pointer-events-none opacity-20 ${ACCENT_GRADIENT}`}
        />
        <div className="relative max-w-7xl mx-auto px-6 pt-10 pb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-audiowide mb-1">
            Public Forum
          </h1>
          <p className="text-gray-300">
            Join discussions and share knowledge with the community
          </p>
        </div>
      </section>
      {/* ✅ End Header */}

      {/* ✅ Centered "Latest Discussions" heading */}
      <div className="text-center mb-8 relative z-10">
        <h2 className="text-2xl font-audiowide tracking-wider">
          Latest Discussions
        </h2>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 pb-12 relative z-10">
        <div className="grid grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="col-span-4 lg:col-span-1">
            <div
              className={`${FEATURE_BG} ${BORDER_COLOR} border rounded-2xl p-6 mb-6`}
            >
              <h2 className="text-xl font-audiowide tracking-wider mb-4">
                Forum Categories
              </h2>

              <button
                className={`w-full text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 mb-6 shadow-md hover:brightness-110 ${ACCENT_GRADIENT}`}
              >
                Start New Thread
              </button>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-300 mb-3">
                  Sections
                </h3>
                <div className="space-y-2">
                  {["Technical", "Behavioral", "Interviewing", "Success"].map(
                    (label) => (
                      <div
                        key={label}
                        className={`flex items-center justify-between p-3 rounded-lg hover:border-cyan-400 transition-colors duration-200 ${BACKGROUND_COLOR} ${BORDER_COLOR} border`}
                      >
                        <span className="text-white">{label}</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Discussions */}
          <div className="col-span-4 lg:col-span-3">
            <div
              className={`${FEATURE_BG} ${BORDER_COLOR} border rounded-2xl p-6`}
            >
              {/* Hide internal duplicate heading */}
              <h2 className="sr-only">Latest Discussions</h2>

              <div className="space-y-4">
                {discussions.map((discussion, index) => (
                  <div
                    key={index}
                    className={`${BACKGROUND_COLOR} ${BORDER_COLOR} border rounded-xl p-6 hover:border-cyan-400/60 transition-colors duration-200`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start space-x-4 flex-grow">
                        <div className="text-2xl mt-1">{discussion.icon}</div>
                        <div className="flex-grow">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-cyan-500/15 text-cyan-300 border border-cyan-600/30">
                              {discussion.category}
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold text-white mb-3 hover:text-cyan-300 cursor-pointer transition-colors duration-200">
                            {discussion.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-400">
                            <div className="flex items-center gap-1">
                              <span>💬</span>
                              <span>{discussion.replies} replies</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span>👁️</span>
                              <span>{discussion.views} views</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span>🕒</span>
                              <span>Last action {discussion.lastAction}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <button className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors duration-200 whitespace-nowrap shadow-md">
                        Join Discussion
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More */}
              <div className="text-center mt-8">
                <button
                  className={`${FEATURE_BG} ${BORDER_COLOR} border hover:border-cyan-400/60 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200`}
                >
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
