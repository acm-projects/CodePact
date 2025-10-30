import React, { useState } from "react";
import LoggedInNavbar from "../components/nav/LoggedInNavBar";
import Footer from "../components/Footer";
import {
  BACKGROUND_COLOR,
  FEATURE_BG,
  BORDER_COLOR,
  ACCENT_GRADIENT,
  GridOverlay,
} from "../utils/constants";

export default function ProfilePage() {
  const [user] = useState({
    name: "Rafay",
    role: "Software Engineer",
    email: "rafay@example.com",
    squad: "Algorithm Avengers",
    location: "Austin, TX",
    bio: "I love building tools that help people collaborate and learn faster.",
  });

  return (
    <div
      className={`min-h-screen ${BACKGROUND_COLOR} text-white relative overflow-hidden font-quicksand`}
    >
      <GridOverlay />
      <LoggedInNavbar />

      {/*  Centered Gradient Header */}
      <section className="relative">
        <div
          className={`absolute inset-0 pointer-events-none opacity-20 ${ACCENT_GRADIENT}`}
        />
        <div className="relative max-w-6xl mx-auto px-6 pt-10 pb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-audiowide tracking-wider mb-2">
            Profile
          </h1>
          <p className="text-gray-400 text-base">
            Manage your account and public details.
          </p>
        </div>
      </section>
      {/* End Header */}

      <main className="max-w-6xl mx-auto px-6 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Profile Card */}
          <section
            className={`rounded-2xl p-6 ${FEATURE_BG} ${BORDER_COLOR} border`}
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center text-2xl">
                🧑‍💻
              </div>
              <div>
                <div className="text-xl font-semibold">{user.name}</div>
                <div className="text-gray-400">{user.role}</div>
              </div>
            </div>

            <div className="mt-6 space-y-3 text-sm">
              <Row label="Email" value={user.email} />
              <Row label="Squad" value={user.squad} />
              <Row label="Location" value={user.location} />
            </div>

            <button
              className={`mt-6 w-full rounded-lg py-2 font-semibold shadow hover:brightness-110 ${ACCENT_GRADIENT}`}
            >
              Edit Profile
            </button>
          </section>

          {/* About Section */}
          <section className="lg:col-span-2 space-y-6">
            <div
              className={`rounded-2xl p-6 ${FEATURE_BG} ${BORDER_COLOR} border`}
            >
              <h2 className="text-lg font-audiowide tracking-wider mb-3">
                About
              </h2>
              <p className="text-gray-300 leading-relaxed">{user.bio}</p>
            </div>

            {/* Preferences Section */}
            <div
              className={`rounded-2xl p-6 ${FEATURE_BG} ${BORDER_COLOR} border`}
            >
              <h2 className="text-lg font-audiowide tracking-wider mb-4">
                Preferences
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Pref label="Dark Mode" value="On" />
                <Pref label="Email Alerts" value="Important only" />
                <Pref label="Weekly Summary" value="Enabled" />
                <Pref label="Reminders" value="Auto-nudge after 7d" />
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  className={`px-4 py-2 rounded-lg font-semibold shadow hover:brightness-110 ${ACCENT_GRADIENT}`}
                >
                  Save
                </button>
                <button
                  className={`px-4 py-2 rounded-lg ${BORDER_COLOR} border hover:border-cyan-400/60`}
                >
                  Reset
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

/*  Subcomponents */
function Row({ label, value }) {
  return (
    <div
      className="flex items-center justify-between rounded-lg px-3 py-2 border text-sm
                    bg-transparent hover:border-cyan-400/60 transition
                    border-gray-700"
    >
      <span className="text-gray-400">{label}</span>
      <span className="text-white">{value}</span>
    </div>
  );
}

function Pref({ label, value }) {
  return (
    <div
      className={`rounded-xl p-4 ${BACKGROUND_COLOR} ${BORDER_COLOR} border`}
    >
      <div className="text-gray-400 text-sm">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}
