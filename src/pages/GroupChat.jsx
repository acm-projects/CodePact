// src/pages/GroupChat.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import Footer from "../components/Footer";

// Backend URL (env takes priority). Your server listens on 8000.
const API_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:8000";

// Socket.IO: cookie-based auth -> we MUST send cookies
const SOCKET_URL = API_URL;       // same origin for sockets

export default function GroupChat() {
  const [activeTab, setActiveTab] = useState("Squads");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);    // from server history + live
  const [connected, setConnected] = useState(false);
  const [whoami, setWhoami] = useState(null);      // authed user from /api/auth/me
  const [conversationId, setConversationId] = useState(null);
  const [bootError, setBootError] = useState("");

  const bottomRef = useRef(null);
  const socketRef = useRef(null);
  const navigate = useNavigate();
  const { state } = useLocation();

  // If a conversation id was passed from Leaderboard, use it
  const initialConvId = state?.conversationId || state?.roomId || null;
  const displayName = state?.displayName || whoami?.name || "You";

  // ----- Helpers ------------------------------------------------------------

  async function ensureAuthCookie() {
    // Try to read current user; if 401, call dev-login to set cp_jwt cookie.
    const me = await fetch(`${API_URL}/api/auth/me`, {
      credentials: "include",
    });
    if (me.status === 200) {
      const data = await me.json();
      setWhoami(data.data);
      return data.data;
    }

    // Dev login: use your email or a placeholder; cookie set via Set-Cookie
    const devEmail = "dev@example.com";
    const resp = await fetch(`${API_URL}/api/auth/dev-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // <- CRITICAL so cookie is stored
      body: JSON.stringify({ email: devEmail, name: "Developer" }),
    });
    if (!resp.ok) {
      throw new Error(`Dev login failed (${resp.status})`);
    }
    const data = await resp.json();
    setWhoami(data.data);
    return data.data;
  }

  async function ensureConversation(idFromRoute) {
    if (idFromRoute) return idFromRoute;

    // Create/seed a conversation for demo/dev if none provided
    const res = await fetch(`${API_URL}/api/dev/seed-conv`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name: "Algorithm Avengers" }),
    });
    if (!res.ok) {
      throw new Error(`Seed conv failed (${res.status})`);
    }
    const data = await res.json();
    return data.data?._id;
  }

  async function loadHistory(convId) {
    const res = await fetch(`${API_URL}/api/conversations/${convId}/messages?limit=50`, {
      credentials: "include",
    });
    if (!res.ok) return;
    const data = await res.json();
    // Map server format -> UI format
    const mapped = (data.data || []).map((m) => ({
      id: m._id,
      user: m.sender === whoami?._id ? whoami?.name || "You" : "Member",
      text: m.text,
      ts: m.createdAt,
    }));
    setMessages(mapped);
  }

  // ----- Boot sequence: auth -> conversation -> socket ---------------------
  useEffect(() => {
    (async () => {
      try {
        setBootError("");
        // 1) Make sure cp_jwt cookie exists (dev login if needed)
        const me = await ensureAuthCookie();

        // 2) Ensure we have a conversation id (use provided or seed)
        const convId = await ensureConversation(initialConvId);
        setConversationId(convId);

        // 3) Load initial message history
        await loadHistory(convId);

        // 4) Open socket (withCredentials: true to send cookie)
        const socket = io(SOCKET_URL, {
          transports: ["websocket", "polling"],
          withCredentials: true,      // CRITICAL for cookie-based auth
          reconnectionAttempts: 10,
          timeout: 10000,
        });
        socketRef.current = socket;

        // Lifecycle logs
        socket.on("connect", () => {
          setConnected(true);
          // Join the conversation room
          socket.emit("conversation:join", { conversationId: convId });
          // console.log("[socket] connected", socket.id);
        });

        socket.on("disconnect", (reason) => {
          setConnected(false);
          // console.warn("[socket] disconnected:", reason);
        });

        socket.on("connect_error", (err) => {
          setConnected(false);
          setBootError(err?.message || "Connection error");
          // console.error("[socket] connect_error:", err?.message || err);
        });

        // Server message events (per your server.js)
        socket.on("message:new", (srvMsg) => {
          setMessages((prev) => [
            ...prev,
            {
              id: srvMsg._id || srvMsg.tempId || Date.now(),
              user: srvMsg.sender === me._id ? me.name || "You" : "Member",
              text: srvMsg.text,
              ts: srvMsg.createdAt || new Date().toISOString(),
            },
          ]);
        });

        // Optional typing echo:
        socket.on("typing", (_payload) => {
          // handle typing indicators if you want
        });

        // Cleanup
        return () => {
          try {
            socket.emit("typing", { conversationId: convId, isTyping: false });
          } catch {}
          socket.disconnect();
        };
      } catch (e) {
        setBootError(String(e.message || e));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialConvId]);

  // auto-scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !socketRef.current || !conversationId) return;

    const tempId = `temp-${Date.now()}`;

    // Optimistic add
    setMessages((prev) => [
      ...prev,
      { id: tempId, user: displayName, text: message.trim(), ts: new Date().toISOString() },
    ]);

    // emit to server (matches server.js: 'message:send')
    socketRef.current.emit(
      "message:send",
      {
        conversationId,
        text: message.trim(),
        tempId,
        attachments: [],
      },
      (ack) => {
        // optional: replace temp with real id
        if (ack?.ok && ack.messageId) {
          setMessages((prev) =>
            prev.map((m) => (m.id === tempId ? { ...m, id: ack.messageId } : m))
          );
        }
      }
    );

    setMessage("");
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === "Home") navigate("/leaderboard");
    else if (tab === "Public Forum") navigate("/public-forum");
  };

  // ----- UI ----------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#0f0f23] text-white">
      {/* Header */}
      <header className="bg-[#0f0f23] border-b border-gray-800 py-4 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="font-bold text-white text-sm">CP</span>
              </div>
              <span className="font-bold text-xl text-white">CodePact</span>
            </div>

            <div className="flex flex-col items-end space-y-2">
              <div className="flex items-center space-x-3">
                <span className="text-white font-medium">{displayName}</span>
                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center border-2 border-blue-500">
                  <span className="text-white font-bold text-sm">👤</span>
                </div>
              </div>

              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-1 rounded-lg transition-colors duration-200 text-sm">
                Squad Creation
              </button>
            </div>
          </div>

          <div className="flex items-center border-b border-gray-700 pb-2">
            <div className="flex space-x-8">
              {["Home","Squads","Public Forum","Messages","AI Interviewer","Reminders & Notifications"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabClick(tab)}
                  className={`font-medium transition-colors duration-200 pb-2 border-b-2 ${
                    activeTab === tab
                      ? "text-blue-400 border-blue-400"
                      : "text-gray-400 hover:text-white border-transparent"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Warning bar if not connected */}
      {bootError && (
        <div className="bg-red-600/20 border border-red-600 text-red-200 text-sm p-3 text-center">
          {bootError} — make sure the backend is running at {API_URL} and that cookies are allowed.
        </div>
      )}

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-4 gap-8">
          {/* Left Sidebar */}
          <div className="col-span-1 bg-[#1a1a2e] border border-gray-800 rounded-2xl p-6 h-fit">
            <h2 className="text-2xl font-bold mb-6 text-white">The Algorithm Avengers</h2>

            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-gray-300">MEMBERS</h3>
              <div className="space-y-3">
                {["John Smith (You)","Jane Dee","Sarah Brooks","Hillary Robinson"].map((name) => (
                  <div key={name} className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-white">{name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-300">SHARED RESOURCES</h3>
              <div className="space-y-3">
                <div className="bg-[#0f0f23] border border-gray-700 rounded-lg p-3 hover:border-blue-500/50 transition-colors duration-200">
                  <div className="text-blue-400 font-medium">LeetCode #123: Two Sum</div>
                  <div className="text-gray-400 text-sm">Shared by Jane Dee</div>
                </div>
                <div className="bg-[#0f0f23] border border-gray-700 rounded-lg p-3 hover:border-blue-500/50 transition-colors duration-200">
                  <div className="text-blue-400 font-medium">Interview-Prep.pdf</div>
                  <div className="text-gray-400 text-sm">Shared by Hillary Robinson</div>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Column */}
          <div className="col-span-3 flex flex-col">
            <div className="bg-[#1a1a2e] border border-gray-800 rounded-t-2xl p-6">
              <h1 className="text-2xl font-bold text-white">Group Chat</h1>
              <p className="text-gray-400">
                Conv: <span className="text-gray-200 font-mono">{conversationId || "…"}</span> •{" "}
                <span className={connected ? "text-lime-400" : "text-gray-400"}>
                  {connected ? "Connected" : "Disconnected"}
                </span>
              </p>
            </div>

            <div className="flex-grow bg-[#0f0f23] border border-gray-800 border-t-0 rounded-b-2xl p-6 max-h-[600px] overflow-y-auto">
              <div className="space-y-6">
                {messages.map((msg) => (
                  <MessageRow key={msg.id} msg={msg} />
                ))}
                <div ref={bottomRef} />
              </div>
            </div>

            <form onSubmit={handleSendMessage} className="mt-4">
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={connected ? "Write a message..." : "Reconnecting…"}
                  disabled={!connected || !conversationId}
                  className="flex-grow px-4 py-3 bg-[#1a1a2e] border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200"
                />
                <button
                  type="submit"
                  disabled={!connected || !conversationId || !message.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function MessageRow({ msg }) {
  const initials = (msg.user || "U")
    .split(" ")
    .map((n) => n[0])
    .join("");

  const text = msg.text ?? msg.content ?? "";

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">{initials}</span>
        </div>
        <div>
          <span className="font-semibold text-white">{msg.user || "User"}</span>
          <span className="text-gray-500 text-sm ml-3">
            {msg.ts ? new Date(msg.ts).toLocaleTimeString() : msg.time || ""}
          </span>
        </div>
      </div>
      <div className="ml-11">
        {isProbablyLink(text) ? (
          <a href={text} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 underline">
            {text}
          </a>
        ) : (
          <p className="text-gray-300">{text}</p>
        )}
      </div>
    </div>
  );
}

function isProbablyLink(s) {
  return typeof s === "string" && /^https?:\/\/\S+/i.test(s);
}
