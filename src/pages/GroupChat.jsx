import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

export default function GroupChat() {
  const [activeTab, setActiveTab] = useState("Squads");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const tabs = [
    "Home", "Squads", "Public Forum", "Messages", "AI Interviewer", "Reminders & Notifications",
  ];

  const messages = [
    { sender: "Sarah Brooks", content: "Hey everyone, has anyone looked at the new LeetCode problem?", time: "2:30 PM" },
    { sender: "Jane Dee", content: "Yeah, I'm stuck on the edge cases. Sharing a link now.", time: "2:32 PM" },
    { sender: "Jane Dee", content: "https://leetcode.com/problems/two-sum", time: "2:32 PM", isLink: true },
    { sender: "Sarah Brooks", content: "Thanks! I'll take a look.", time: "2:33 PM" },
    { sender: "John Smith", content: "I'll try taking a look at it too!", time: "2:35 PM" },
    { sender: "John Smith", content: "Also, could one of you send the interview prep document?", time: "2:36 PM" },
    { sender: "Hillary Robinson", content: "Sure! Interview-Prep.pdf", time: "2:38 PM", isFile: true },
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      // Handle sending message
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === "Home") {
      navigate("/leaderboard");
    } else if (tab === "Public Forum") {
      navigate("/public-forum");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f23] text-white">
      {/* Custom Header */}
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

            {/* User Info and Squad Creation */}
            <div className="flex flex-col items-end space-y-2">
              {/* User Name and Profile Picture */}
              <div className="flex items-center space-x-3">
                <span className="text-white font-medium">Name</span>
                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center border-2 border-blue-500">
                  <span className="text-white font-bold text-sm">👤</span>
                </div>
              </div>
              
              {/* Squad Creation Button */}
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-1 rounded-lg transition-colors duration-200 text-sm">
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
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-4 gap-8">
          {/* Left Sidebar - Squad Info */}
          <div className="col-span-1 bg-[#1a1a2e] border border-gray-800 rounded-2xl p-6 h-fit">
            <h2 className="text-2xl font-bold mb-6 text-white">The Algorithm Avengers</h2>
            
            {/* Members Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-gray-300">MEMBERS</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-white">John Smith (You)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-white">Jane Dee</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-white">Sarah Brooks</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-white">Hillary Robinson</span>
                </div>
              </div>
            </div>

            {/* Shared Resources Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-300">SHARED RESOURCES</h3>
              <div className="space-y-3">
                <div className="bg-[#0f0f23] border border-gray-700 rounded-lg p-3 hover:border-blue-500/50 transition-colors duration-200">
                  <div className="text-blue-400 font-medium">LeetCode #123: Two Sum</div>
                  <div className="text-gray-400 text-sm">Shared by Jane Dee</div>
                </div>
                <div className="bg-[#0f0f23] border border-gray-700 rounded-lg p-3 hover:border-blue-500/50 transition-colors duration-200">
                  <div className="text-blue-400 font-medium">Interview-Prep.pdf</div>
                  <div className="text-gray-400 text-sm">Shared by Hillary Robinson</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Chat Area */}
          <div className="col-span-3 flex flex-col">
            {/* Chat Header */}
            <div className="bg-[#1a1a2e] border border-gray-800 rounded-t-2xl p-6">
              <h1 className="text-2xl font-bold text-white">Group Chat</h1>
              <p className="text-gray-400">The Algorithm Avengers</p>
            </div>

            {/* Messages Area */}
            <div className="flex-grow bg-[#0f0f23] border border-gray-800 border-t-0 rounded-b-2xl p-6 max-h-[600px] overflow-y-auto">
              <div className="space-y-6">
                {messages.map((msg, index) => (
                  <div key={index} className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {msg.sender.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-white">{msg.sender}</span>
                        <span className="text-gray-500 text-sm ml-3">{msg.time}</span>
                      </div>
                    </div>
                    <div className="ml-11">
                      {msg.isLink ? (
                        <a href={msg.content} className="text-blue-400 hover:text-blue-300 underline">
                          {msg.content}
                        </a>
                      ) : msg.isFile ? (
                        <div className="flex items-center space-x-2 text-blue-400">
                          <span>📎</span>
                          <span className="hover:text-blue-300 cursor-pointer">{msg.content}</span>
                        </div>
                      ) : (
                        <p className="text-gray-300">{msg.content}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="mt-4">
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write a message..."
                  className="flex-grow px-4 py-3 bg-[#1a1a2e] border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}