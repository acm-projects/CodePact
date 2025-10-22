import React from "react";
import LoggedInNavbar from "../components/nav/LoggedInNavbar";
import Footer from "../components/Footer";
import NotificationCard from "../components/reminders/NotificationCard";
import {
  BACKGROUND_COLOR,
  FEATURE_BG,
  BORDER_COLOR,
  ACCENT_GRADIENT,
  GridOverlay,
} from "../utils/constants";

export default function Notifications() {
  const notifications = [
    {
      type: "application",
      text: "You applied for a ‘Data Science Intern’ role at Google.",
      time: "2h",
    },
    { type: "message", text: "Mentor Emily sent you a message.", time: "5h" },
    {
      type: "application",
      text: "You applied for a ‘Software Engineering Intern’ role at Microsoft.",
      time: "1d",
    },
    { type: "message", text: "Bob James sent you a message.", time: "2d" },
    {
      type: "application",
      text: "You applied for a ‘Product Management Intern’ role at Airbnb.",
      time: "3d",
    },
  ];

  return (
    <div
      className={`min-h-screen ${BACKGROUND_COLOR} text-white relative overflow-hidden font-quicksand`}
    >
      <GridOverlay />
      <LoggedInNavbar />

      {/* ✅ Gradient Header Band */}
      <section className="relative">
        <div
          className={`absolute inset-0 pointer-events-none opacity-20 ${ACCENT_GRADIENT}`}
        />
        <div className="relative px-6 md:px-8 pt-10 pb-8 max-w-5xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-audiowide tracking-wider mb-2">
            Notifications
          </h1>
          <p className="text-gray-400 text-base">
            Stay updated on your applications, messages, and squad activity.
          </p>
        </div>
      </section>
      {/* ✅ End Gradient Header */}

      {/* Notifications Section */}
      <div className="px-6 md:px-8 py-10 md:py-14 max-w-5xl mx-auto relative z-10">
        <section
          className={`${FEATURE_BG} ${BORDER_COLOR} border rounded-2xl p-6 md:p-8 shadow-lg`}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg md:text-xl font-semibold">
              Recent Notifications
            </h2>
            <button
              onClick={() => console.log("Mark all as read")}
              className={`px-3 py-1 rounded-lg text-sm font-semibold shadow hover:brightness-110 ${ACCENT_GRADIENT}`}
            >
              Mark all as read
            </button>
          </div>

          <div className="space-y-5">
            {notifications.map((n, i) => (
              <NotificationCard key={i} data={n} />
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
