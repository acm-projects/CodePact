// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Leaderboard from "./pages/Leaderboard";
import GroupChat from "./pages/GroupChat";
import PublicForum from "./pages/Forum";
import CreateAccount from "./pages/CreateAccount";
import Congratulations from "./pages/Congratulations";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/group-chat" element={<GroupChat />} />
        <Route path="/public-forum" element={<PublicForum />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/congratulations" element={<Congratulations />} />
      </Routes>
    </Router>
  );
}

export default App;
