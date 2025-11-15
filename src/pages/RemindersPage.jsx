import React from "react";
import NotificationCard from "../components/reminders/NotificationCard";
import SquadReminderCard from "../components/reminders/SquadReminderCard";
import LoggedInNavbar from "../components/nav/LoggedInNavbar";
import Footer from "../components/Footer";

export default function RemindersPage() {
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

  const squad = [
    { name: "Sam", lastActivityDays: 8, type: "application" },
    { name: "Ava", lastActivityDays: 14, type: "problem" },
    { name: "Rafay", lastActivityDays: 2, type: "problem" },
    { name: "Noah", lastActivityDays: 0, type: "application" },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      {/* Navbar */}
      <LoggedInNavbar />

      <div className="px-8 py-12 md:py-16 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">Reminders & Notifications</h1>
          <p className="text-[var(--muted)] text-base">
            Track your squad’s performance and stay updated on your applications
            and messages.
          </p>
        </div>

        {/* Main content grid */}
        <div className="grid gap-10 md:grid-cols-2">
          {/* Notifications Section */}
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

          {/* Squad Section */}
          <section className="bg-[var(--panel)] border border-[var(--border)] rounded-2xl p-8 shadow-lg">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold">Squad Activity Tracker</h2>
              <span className="text-sm text-[var(--muted)]">
                Remind teammates to stay on track.
              </span>
            </div>

            <div className="space-y-5">
              {squad.map((m, i) => (
                <SquadReminderCard key={i} member={m} />
              ))}
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
