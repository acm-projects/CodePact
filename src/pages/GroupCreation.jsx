import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import LoggedInNavbar from "../components/nav/LoggedInNavBar";
import { groupAPI } from "../utils/api";

import {
  BACKGROUND_COLOR,
  FEATURE_BG,
  BORDER_COLOR,
  ACCENT_GRADIENT,
  GridOverlay,
} from "../utils/constants";

export default function GroupCreation() {
  const [activeTab, setActiveTab] = useState("Create");
  const [squadName, setSquadName] = useState("");
  const [inviteFriends, setInviteFriends] = useState("");
  const [joinCode, setJoinCode] = useState("");
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

  const handleCreateSquad = async (e) => {
    e.preventDefault();
    
    console.log("🟢 [CREATE GROUP FRONTEND] Form submitted");
    console.log("🟢 [CREATE GROUP FRONTEND] Squad name:", squadName);
    console.log("🟢 [CREATE GROUP FRONTEND] Squad name trimmed:", squadName.trim());
    console.log("🟢 [CREATE GROUP FRONTEND] Squad name length:", squadName.trim().length);
    
    if (!squadName.trim()) {
      console.log("🟢 [CREATE GROUP FRONTEND] Validation failed: empty squad name");
      return;
    }

    const requestData = {
      name: squadName.trim(),
      members: "0"
    };
    
    console.log("🟢 [CREATE GROUP FRONTEND] Request data:", requestData);
    console.log("🟢 [CREATE GROUP FRONTEND] Calling addGroupData API...");

    try {
      const result = await groupAPI.addGroupData(requestData);
      
      console.log("🟢 [CREATE GROUP FRONTEND] API response received");
      console.log("🟢 [CREATE GROUP FRONTEND] Response ok:", result.ok);
      console.log("🟢 [CREATE GROUP FRONTEND] Response status:", result.status);
      console.log("🟢 [CREATE GROUP FRONTEND] Response data:", result.data);
      console.log("🟢 [CREATE GROUP FRONTEND] Response error:", result.error);
      
      if (result.ok) {
        console.log("🟢 [CREATE GROUP FRONTEND] Group created successfully!");
        console.log("🟢 [CREATE GROUP FRONTEND] Group list returned:", result.data);
        alert(`✅ Squad "${squadName}" created successfully!`);
        setSquadName("");
        setInviteFriends("");
        navigate("/squads", { state: { refreshGroups: true, newGroupName: squadName.trim() } });
      } else {
        console.log("🟢 [CREATE GROUP FRONTEND] Group creation failed");
        console.log("🟢 [CREATE GROUP FRONTEND] Error message:", result.error);
        if (result.data && typeof result.data === 'object' && result.data.debug) {
          console.log("🟢 [CREATE GROUP FRONTEND] Debug info:", result.data.debug);
          console.log("🟢 [CREATE GROUP FRONTEND] Requested name:", result.data.debug.requestedName);
          console.log("🟢 [CREATE GROUP FRONTEND] Existing name:", result.data.debug.existingGroupName);
          console.log("🟢 [CREATE GROUP FRONTEND] Names match:", result.data.debug.nameMatch);
          console.log("🟢 [CREATE GROUP FRONTEND] All group names in DB:", result.data.debug.allGroupNames);
        }
        alert(result.error || (result.data && typeof result.data === 'object' ? result.data.message : result.data) || "Failed to create squad");
      }
    } catch (error) {
      console.error("🟢 [CREATE GROUP FRONTEND] Exception caught:", error);
      console.error("🟢 [CREATE GROUP FRONTEND] Error message:", error.message);
      console.error("🟢 [CREATE GROUP FRONTEND] Error stack:", error.stack);
      alert("An error occurred while creating the squad");
    }
  };

  const handleJoinSquad = (e) => {
    e.preventDefault();
    if (joinCode.trim()) {
      alert(`🔗 Joined squad with code: ${joinCode}`);
      setJoinCode("");
    }
  };

  return (
    <div
      className={`min-h-screen relative ${BACKGROUND_COLOR} text-white font-quicksand`}
    >
      <GridOverlay />

      {/* Header */}
      <LoggedInNavbar />

      {/* Main Section */}
      <main className="max-w-5xl mx-auto px-6 py-7 text-center relative z-10">
        <h1 className="text-3xl md:text-4xl font-audiowide mb-4">
          START YOUR{" "}
          <span className={`bg-clip-text text-transparent ${ACCENT_GRADIENT}`}>
            COLLABORATION
          </span>
        </h1>
        <p className="text-gray-400 mb-10">
          Create a new squad or join an existing one to team up with your
          friends.
        </p>

        {/* Create / Join Tabs */}
        <div className="relative flex justify-center items-center mb-8">
          {/* Animated underline only (no gray line or padding gap) */}
          <div
            className={`absolute bottom-0 transition-all duration-500 ease-in-out ${
              activeTab === "Create"
                ? "left-[calc(50%-100px)] w-[90px] bg-cyan-400 shadow-[0_0_8px_2px_rgba(0,255,255,0.4)]"
                : "left-[calc(50%+10px)] w-[80px] bg-fuchsia-400 shadow-[0_0_8px_2px_rgba(255,0,255,0.4)]"
            } h-[2px] rounded-full`}
          ></div>

          <div className="relative flex space-x-6 bg-[#0a0a1a]">
            <button
              onClick={() => setActiveTab("Create")}
              className={`px-5 py-2 rounded-t-md font-semibold text-sm border-b-2 transition-all duration-300 transform ${
                activeTab === "Create"
                  ? "text-cyan-400 border-cyan-400 shadow-[0_0_10px_rgba(0,255,255,0.4)] scale-105"
                  : "text-gray-400 border-transparent hover:text-white hover:scale-105"
              }`}
            >
              Create a Squad
            </button>
            <button
              onClick={() => setActiveTab("Join")}
              className={`px-5 py-2 rounded-t-md font-semibold text-sm border-b-2 transition-all duration-300 transform ${
                activeTab === "Join"
                  ? "text-fuchsia-400 border-fuchsia-400 shadow-[0_0_10px_rgba(255,0,255,0.4)] scale-105"
                  : "text-gray-400 border-transparent hover:text-white hover:scale-105"
              }`}
            >
              Join a Squad
            </button>
          </div>
        </div>

        {/* Dynamic Form (Create / Join) */}
        <div
          className={`${FEATURE_BG} ${BORDER_COLOR} border rounded-2xl max-w-md mx-auto p-8 shadow-lg hover:shadow-cyan-500/10 transition-shadow duration-300 text-left`}
        >
          {activeTab === "Create" ? (
            <>
              <h2 className="text-xl font-bold mb-6 text-white">
                Create a Squad
              </h2>
              <form onSubmit={handleCreateSquad} className="space-y-5">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Squad Name
                  </label>
                  <input
                    type="text"
                    value={squadName}
                    onChange={(e) => setSquadName(e.target.value)}
                    placeholder="e.g., The Algorithm Avengers"
                    className={`${FEATURE_BG} border ${BORDER_COLOR} rounded-lg w-full px-4 py-3 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white`}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Invite Friends
                  </label>
                  <input
                    type="text"
                    value={inviteFriends}
                    onChange={(e) => setInviteFriends(e.target.value)}
                    placeholder="Search for friends by username..."
                    className={`${FEATURE_BG} border ${BORDER_COLOR} rounded-lg w-full px-4 py-3 focus:outline-none focus:border-fuchsia-400 focus:ring-1 focus:ring-fuchsia-400 text-white`}
                  />
                </div>

                <button
                  type="submit"
                  className={`${ACCENT_GRADIENT} w-full py-3 rounded-lg font-semibold text-white shadow-md hover:brightness-110 transition-all duration-200`}
                >
                  Create Squad
                </button>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold mb-6 text-white">
                Join a Squad
              </h2>
              <form onSubmit={handleJoinSquad} className="space-y-5">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Squad Code or Invitation Link
                  </label>
                  <input
                    type="text"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    placeholder="Paste the code or link here..."
                    className={`${FEATURE_BG} border ${BORDER_COLOR} rounded-lg w-full px-4 py-3 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white`}
                  />
                </div>

                <button
                  type="submit"
                  className={`${ACCENT_GRADIENT} w-full py-3 rounded-lg font-semibold text-white shadow-md hover:brightness-110 transition-all duration-200`}
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
