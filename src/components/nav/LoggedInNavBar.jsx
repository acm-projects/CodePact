import { useEffect, useRef, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { User, Bell } from "lucide-react"; // npm i lucide-react
import AddActivityModal from "../activity/AddActivityModal";

export default function LoggedInNavbar() {
  const tabs = [
    { name: "Home", path: "/leaderboard" },
    { name: "Squads", path: "/squads" },
    { name: "Public Forum", path: "/public-forum" },
    { name: "Messages", path: "/messages" },
    { name: "AI Interviewer", path: "/ai-interviewer" },
  ];

  const [open, setOpen] = useState(false); // profile menu
  const [addOpen, setAddOpen] = useState(false); // Add Activity modal
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

  const handleLogout = () => {
    navigate("/"); // back to landing page
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#0f0f23] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Left: brand */}
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="font-bold text-white text-sm">CP</span>
              </div>
              <span className="font-bold text-xl text-white">CodePact</span>
            </div>

            {/* Middle: tabs */}
            <nav className="hidden md:flex items-center space-x-8">
              {tabs.map((t) => (
                <NavLink
                  key={t.name}
                  to={t.path}
                  className={({ isActive }) =>
                    `font-medium pb-2 border-b-2 transition-colors duration-200 ${
                      isActive
                        ? "text-blue-400 border-blue-400"
                        : "text-gray-400 hover:text-white border-transparent"
                    }`
                  }
                  end={t.path === "/"}
                >
                  {t.name}
                </NavLink>
              ))}
            </nav>

            {/* Right: +Add Activity + bell + profile */}
            <div className="flex items-center gap-3">
              {/* + Add Activity (desktop) */}
              <button
                onClick={() => setAddOpen(true)}
                className="hidden md:inline-flex bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition"
                title="Log an application, interview, or problem"
              >
                + Add Activity
              </button>

              {/* + Add Activity (mobile icon) */}
              <button
                onClick={() => setAddOpen(true)}
                className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full
                           border-2 border-blue-500 bg-blue-600 hover:bg-blue-500
                           text-white font-bold"
                aria-label="Add Activity"
                title="Add Activity"
              >
                +
              </button>

              {/* Notifications bell */}
              <Link
                to="/notifications"
                aria-label="Notifications"
                className="relative inline-flex h-10 w-10 items-center justify-center rounded-full
                           border-2 border-blue-500 bg-gray-600 hover:bg-gray-500
                           focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                title="Notifications"
              >
                <Bell className="h-5 w-5 text-white" />
                {/* Optional unread badge */}
                {/* <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center">
                  3
                </span> */}
              </Link>

              {/* Profile dropdown */}
              <div
                ref={menuRef}
                className="relative"
                onMouseEnter={() => setOpen(true)}
              >
                <button
                  aria-haspopup="menu"
                  aria-expanded={open}
                  aria-label="User menu"
                  onClick={() => setOpen((v) => !v)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full
                             border-2 border-blue-500 bg-gray-600 hover:bg-gray-500
                             focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                >
                  <User className="h-5 w-5 text-white pointer-events-none" />
                </button>

                {open && (
                  <div
                    role="menu"
                    aria-label="User options"
                    className="absolute right-0 top-full translate-y-1 w-48 rounded-xl border border-gray-800
                               bg-[#0f0f23] shadow-lg z-50 overflow-hidden pointer-events-auto"
                    onMouseEnter={() => setOpen(true)}
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
      </header>

      {/* Global Add Activity modal (available on every page) */}
      <AddActivityModal open={addOpen} onClose={() => setAddOpen(false)} />
    </>
  );
}
