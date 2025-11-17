import React, { useEffect, useState } from "react";
import axios from "axios";
import NotificationCard from "../components/reminders/NotificationCard";
import SquadReminderCard from "../components/reminders/SquadReminderCard";
import LoggedInNavbar from "../components/nav/LoggedInNavBar";
import Footer from "../components/Footer";

export default function RemindersPage() {
  const [notifications, setNotifications] = useState([]);
  const [squad, setSquad] = useState([]);

  // Replace this with your real user ID once auth is integrated
  const userId = "6717b9b12345abcd12345678";

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/reminders/user/${userId}`);
        setNotifications(res.data.reminders || []);
      } catch (err) {
        console.error("Error fetching reminders:", err);
      }
    };
    fetchReminders();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <LoggedInNavbar />

      <div className="px-8 py-12 md:py-16 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">Reminders & Notifications</h1>
          <p className="text-[var(--muted)] text-base">
            Track your squad’s performance and stay updated on your applications
            and messages.
          </p>
        </div>

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
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <NotificationCard
                    key={n._id}
                    data={{
                      type: "reminder",
                      text: n.title,
                      time: new Date(n.dueDate).toLocaleDateString(),
                    }}
                  />
                ))
              ) : (
                <p className="text-[var(--muted)] text-sm">No reminders yet.</p>
              )}
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
