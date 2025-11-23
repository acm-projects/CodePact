import React, { useEffect, useState } from "react";
import axios from "axios";
import LoggedInNavbar from "../components/nav/LoggedInNavBar";
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
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = "YOUR_USER_ID_HERE"; // replace with actual logged-in user's ID

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/notifications/${userId}`);
        setNotifications(res.data);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userId]);

  const markAsRead = async (id) => {
    try {
      await axios.patch(`http://localhost:8000/api/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  return (
    <div
      className={`min-h-screen ${BACKGROUND_COLOR} text-white relative overflow-hidden font-quicksand`}
    >
      <GridOverlay />
      <LoggedInNavbar />

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

      <div className="px-6 md:px-8 py-10 md:py-14 max-w-5xl mx-auto relative z-10">
        <section
          className={`${FEATURE_BG} ${BORDER_COLOR} border rounded-2xl p-6 md:p-8 shadow-lg`}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg md:text-xl font-semibold">
              Recent Notifications
            </h2>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : notifications.length === 0 ? (
            <p className="text-gray-400">No notifications yet.</p>
          ) : (
            <div className="space-y-5">
              {notifications.map((n) => (
                <div key={n._id} onClick={() => markAsRead(n._id)}>
                  <NotificationCard data={{
                    type: n.type,
                    text: n.message,
                    time: new Date(n.createdAt).toLocaleString(),
                  }} />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <Footer />
    </div>
  );
}
