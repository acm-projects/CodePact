import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Leaderboard from "./pages/Leaderboard";
import GroupChat from "./pages/GroupChat";
import PublicForum from "./pages/Forum";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0f0f23] text-white">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/group-chat" element={<GroupChat />} />
          <Route path="/public-forum" element={<PublicForum />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;