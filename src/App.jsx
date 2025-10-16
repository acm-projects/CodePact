import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Welcome from "./pages/Welcome.jsx";
import Login from "./pages/Login.jsx";
import Leaderboard from "./pages/Leaderboard.jsx";
import Messages from "./pages/Messages.jsx";
import Forum from "./pages/Forum.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import RemindersPage from "./pages/RemindersPage.jsx";
import Squads from "./pages/Squads.jsx";
import Notifications from "./pages/Notifications.jsx";
import { ActivityProvider } from "./components/activity/ActivityContext";

// Landing + sessions
import AIInterviewerLanding from "./pages/AIInterviewerLanding.jsx";
import AIInterviewerBasic from "./pages/AIInterviewerBasic.jsx"; // interviewer (no prompts)
import AIInterviewerWithSuggestions from "./pages/AIInterviewerWithSuggestions.jsx"; // interviewer (with prompts)
import AIIntervieweeSession from "./pages/AIIntervieweeSession.jsx"; // interviewee

// NEW
import InterviewFeedback from "./pages/InterviewFeedback.jsx";
import InterviewHistory from "./pages/InterviewHistory.jsx";

export default function App() {
  return (
    <ActivityProvider>
      <Router>
        <div className="min-h-screen bg-[#0f0f23] text-white">
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/public-forum" element={<Forum />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/reminders" element={<RemindersPage />} />
            <Route path="/squads" element={<Squads />} />
            <Route path="/notifications" element={<Notifications />} />

            {/* Landing */}
            <Route path="/interview" element={<AIInterviewerLanding />} />

            {/* Sessions */}
            <Route path="/interview/session" element={<AIInterviewerBasic />} />
            <Route
              path="/interview/session/suggestions"
              element={<AIInterviewerWithSuggestions />}
            />
            <Route
              path="/interview/session/interviewee"
              element={<AIIntervieweeSession />}
            />

            {/* Feedback & History */}
            <Route path="/interview/feedback" element={<InterviewFeedback />} />
            <Route path="/interview/history" element={<InterviewHistory />} />

            {/* Optional redirects for old links */}
            <Route
              path="/ai-interviewer"
              element={<Navigate to="/interview" replace />}
            />
            <Route
              path="/ai-interviewer/suggestions"
              element={<Navigate to="/interview/session/suggestions" replace />}
            />

            {/* 404 */}
            <Route path="*" element={<div className="p-6">Not Found</div>} />
          </Routes>
        </div>
      </Router>
    </ActivityProvider>
  );
}
