import { useEffect, useRef, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { User, Bell } from "lucide-react";
import AddActivityModal from "../activity/AddActivityModal";
import {
  BACKGROUND_COLOR,
  ACCENT_GRADIENT,
  FEATURE_BG,
  BORDER_COLOR,
} from "../../utils/constants";

export default function LoggedInNavbar() {
  const tabs = [
    { name: "Home", path: "/leaderboard" },
    { name: "Squads", path: "/squads" },
    { name: "Public Forum", path: "/public-forum" },
    { name: "Messages", path: "/messages" },
    { name: "AI Interviewer", path: "/interview" },
  ];

  const [open, setOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onDown = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        setAddOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const handleLogout = () => navigate("/");

  return (
    <>
      <header
        className={`sticky top-0 z-50 ${BACKGROUND_COLOR} ${BORDER_COLOR} border-b font-quicksand`}
      >
        <div className="w-full px-6 md:px-10">
          {/* Taller navbar height */}
          <div className="flex items-center justify-between gap-6 py-6">
            {/* Brand — aligned flush left */}
            <Link
              to="/leaderboard"
              className="flex items-center space-x-3 absolute left-6 md:left-10"
            >
              <div
                className={`w-10 h-10 ${ACCENT_GRADIENT} rounded-lg flex items-center justify-center`}
              >
                <span className="font-bold text-white text-sm">CP</span>
              </div>
              <span className="font-audiowide text-white text-xl tracking-wide">
                CodePact
              </span>
            </Link>

            {/* Centered Tabs */}
            <nav className="hidden md:flex items-center space-x-10 mx-auto">
              {tabs.map((t) => (
                <NavLink
                  key={t.name}
                  to={t.path}
                  end={t.path === "/"}
                  className={({ isActive }) =>
                    `pb-2 border-b-2 transition-colors duration-200 font-medium ${
                      isActive
                        ? "text-white border-b-cyan-400"
                        : "text-gray-400 hover:text-white border-transparent"
                    }`
                  }
                >
                  {t.name}
                </NavLink>
              ))}
            </nav>

            {/* Right side (buttons + icons) */}
            <div className="flex items-center gap-3 ml-auto">
              {/* Desktop action buttons */}
              <div className="hidden md:flex items-center gap-3">
                {/* Assemble Squad */}
                <button
                  onClick={() => navigate("/squads")}
                  className={`inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-white font-semibold transition shadow-md hover:brightness-110 ${ACCENT_GRADIENT}`}
                  title="Create or join a squad"
                >
                  Assemble Squad
                </button>

                {/* Add Activity */}
                <button
                  onClick={() => setAddOpen(true)}
                  className={`inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-white font-semibold transition shadow-md hover:brightness-110 ${ACCENT_GRADIENT}`}
                  title="Log an application or interview"
                >
                  + Add Activity
                </button>
              </div>

              {/* Mobile buttons */}
              <div className="md:hidden flex items-center gap-2">
                <button
                  onClick={() => navigate("/squads")}
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-white font-bold shadow ${ACCENT_GRADIENT}`}
                  aria-label="Assemble Squad"
                  title="Assemble Squad"
                >
                  👥
                </button>
                <button
                  onClick={() => setAddOpen(true)}
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-white font-bold shadow ${ACCENT_GRADIENT}`}
                  aria-label="Add Activity"
                  title="Add Activity"
                >
                  +
                </button>
              </div>

              {/* Divider + Icons on far right */}
              <div className="flex items-center gap-3 pl-3 ml-3 border-l border-gray-700">
                {/* Notifications */}
                <Link
                  to="/notifications"
                  aria-label="Notifications"
                  title="Notifications"
                  className={`relative inline-flex h-10 w-10 items-center justify-center rounded-full transition focus:outline-none focus:ring-2 focus:ring-cyan-400 ${FEATURE_BG} ${BORDER_COLOR} border`}
                >
                  <Bell className="h-5 w-5 text-white" />
                </Link>

                {/* Profile Dropdown */}
                <div ref={menuRef} className="relative">
                  <button
                    aria-haspopup="menu"
                    aria-expanded={open}
                    aria-label="User menu"
                    onClick={() => setOpen((v) => !v)}
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-full transition focus:outline-none focus:ring-2 focus:ring-cyan-400 ${FEATURE_BG} ${BORDER_COLOR} border`}
                  >
                    <User className="h-5 w-5 text-white pointer-events-none" />
                  </button>

                  {open && (
                    <div
                      role="menu"
                      aria-label="User options"
                      onMouseLeave={() => setOpen(false)}
                      className={`absolute right-0 top-full mt-2 w-48 rounded-xl overflow-hidden shadow-lg z-50 ${BACKGROUND_COLOR} ${BORDER_COLOR} border`}
                    >
                      <Link
                        to="/profile"
                        role="menuitem"
                        onClick={() => setOpen(false)}
                        className="block px-4 py-2 text-sm text-white hover:bg-[#131a48] transition"
                      >
                        View Profile
                      </Link>
                      <button
                        role="menuitem"
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-[#131a48] transition"
                      >
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* divider line */}
          <div className="h-[2px] bg-gray-700 opacity-70" />
        </div>
      </header>

      {/* Global Add Activity modal */}
      <AddActivityModal open={addOpen} onClose={() => setAddOpen(false)} />
    </>
  );
}
