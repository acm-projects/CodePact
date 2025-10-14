import { useEffect, useRef, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { User } from "lucide-react"; // npm i lucide-react
// import { Link } from "react-router-dom";

export default function LoggedInNavbar() {
  const tabs = [
    { name: "Home", path: "/leaderboard" },
    { name: "Squads", path: "/group-chat" },
    { name: "Public Forum", path: "/public-forum" },
    { name: "Messages", path: "/group-chat" }, // change if you add /messages
    { name: "AI Interviewer", path: "/ai-interviewer" }, // add later
    { name: "Reminders & Notifications", path: "/reminders" }, // add later
  ];

  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // close on outside click + Esc
  useEffect(() => {
    const onDown = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const handleLogout = () => {
    // TODO: clear auth/session if you have one
    navigate("/"); // back to landing page
  };

  return (
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

          {/* Right: profile icon + dropdown (hover OR click) */}
          <div
            ref={menuRef}
            className="relative"
            onMouseEnter={() => setOpen(true)} // open on hover
          >
            <button
              aria-haspopup="menu"
              aria-expanded={open}
              aria-label="User menu"
              onClick={() => setOpen((v) => !v)} // toggle on click (mobile-friendly)
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
                onMouseEnter={() => setOpen(true)} // keep open when hovering menu
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
    </header>
  );
}
