// src/App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ActivityProvider } from "./components/activity/ActivityContext";

// Core pages
import Welcome from "./pages/Welcome.jsx";
import Login from "./pages/Login.jsx";
import CreateAccount from "./pages/CreateAccount.jsx";
import Congratulations from "./pages/Congratulations.jsx";
import Leaderboard from "./pages/Leaderboard.jsx";
import Messages from "./pages/Messages.jsx";
import Forum from "./pages/Forum.jsx";
import ThreadView from "./pages/ThreadView.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import RemindersPage from "./pages/RemindersPage.jsx";
import Squads from "./pages/Squads.jsx";
import Notifications from "./pages/Notifications.jsx";
import GroupCreation from "./pages/GroupCreation.jsx";

// AI Interviewer
import AIInterviewerLanding from "./pages/AIInterviewerLanding.jsx";
import AIInterviewerBasic from "./pages/AIInterviewerBasic.jsx";
import AIInterviewerWithSuggestions from "./pages/AIInterviewerWithSuggestions.jsx";
import AIIntervieweeSession from "./pages/AIIntervieweeSession.jsx";
import InterviewFeedback from "./pages/InterviewFeedback.jsx";
import InterviewHistory from "./pages/InterviewHistory.jsx";

export default function App() {
  return (
    <ActivityProvider>
      <Router>
        <div className="min-h-screen bg-[#0f0f23] text-white">
          <Routes>
            {/* Auth / Landing */}
            <Route path="/" element={<Welcome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/create-account" element={<CreateAccount />} />
            <Route path="/congratulations" element={<Congratulations />} />

            {/* App */}
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/public-forum" element={<Forum />} />
            <Route path="/public-forum/thread/:id" element={<ThreadView />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/reminders" element={<RemindersPage />} />
            <Route path="/squads" element={<Squads />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/group-creation" element={<GroupCreation />} />

            {/* AI Interviewer */}
            <Route path="/interview" element={<AIInterviewerLanding />} />
            <Route path="/interview/session" element={<AIInterviewerBasic />} />
            <Route
              path="/interview/session/suggestions"
              element={<AIInterviewerWithSuggestions />}
            />
            <Route
              path="/interview/session/interviewee"
              element={<AIIntervieweeSession />}
            />
            <Route path="/interview/feedback" element={<InterviewFeedback />} />
            <Route path="/interview/history" element={<InterviewHistory />} />

            {/* Legacy redirects from older nav labels */}
            <Route
              path="/ai-interviewer"
              element={<Navigate to="/interview" replace />}
            />
            <Route
              path="/group-chat"
              element={<Navigate to="/messages" replace />}
            />

            {/* 404 */}
            <Route path="*" element={<div className="p-6">Not Found</div>} />
          </Routes>
        </div>
      </Router>
    </ActivityProvider>
  );
}
