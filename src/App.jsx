import { BrowserRouter, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome.jsx";
import Login from "./pages/Login.jsx";                 
import Leaderboard from "./pages/Leaderboard.jsx";
// import GroupChat from "./pages/GroupChat.jsx";
// import PublicForum from "./pages/Forum.jsx";
import CreateAccount from "./pages/CreateAccount.jsx";
// import Congratulations from "./pages/Congratulations.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </BrowserRouter>
  );
}
