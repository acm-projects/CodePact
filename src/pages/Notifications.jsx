import React from "react";
import LoggedInNavbar from "../components/nav/LoggedInNavbar";
import Footer from "../components/Footer";
import NotificationCard from "../components/reminders/NotificationCard";

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
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      {/* Navbar */}
      <LoggedInNavbar />

      {/* Page Header */}
      <div className="px-8 py-12 md:py-16 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">Notifications</h1>
          <p className="text-[var(--muted)] text-base">
            Stay updated on your applications, messages, and squad activity.
          </p>
        </div>

        {/* Notifications List */}
        <section className="bg-[var(--panel)] border border-[var(--border)] rounded-2xl p-8 shadow-lg">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-semibold">Recent Notifications</h2>
            <button
              onClick={() => console.log("Mark all as read")}
              className="text-[var(--accent)] text-sm hover:underline"
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
