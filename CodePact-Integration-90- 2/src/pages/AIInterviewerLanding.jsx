
import React, { useState , useEffect} from "react";
import { useNavigate } from "react-router-dom";
import LoggedInNavBar from "../components/nav/LoggedInNavBar.jsx";
import Panel from "../components/ai/Panel.jsx";
import Footer from "../components/Footer.jsx";
import { Copy, RefreshCcw, ChevronRight } from "lucide-react";
import {
  BACKGROUND_COLOR,
  FEATURE_BG,
  BORDER_COLOR,
  ACCENT_GRADIENT,
  GridOverlay,
} from "../utils/constants";
import { initSocket, getSocket } from "../socket";


function genRoomCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 6; i++)
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return out;
}

export default function AIInterviewerLanding() {
  const navigate = useNavigate();
  const [role, setRole] = useState("interviewer");
  const [withPrompts, setWithPrompts] = useState(true);
  const [invitee, setInvitee] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [room, setRoom] = useState(genRoomCode());

  const destFor = (r, prompts) => {
    if (r === "interviewee") return "/interview/session/interviewee";
    return prompts ? "/interview/session/suggestions" : "/interview/session";
  };

  const start = () => {
    let socket = getSocket();
    if(!socket)
    {
      initSocket();
      socket = getSocket();
    }
    if(joinCode.trim())
    {
      socket.emit("joinRoom", {roomId:joinCode,role:role});
    }
    else{
      socket.emit("joinRoom", {roomId:room,role:role});
    }

    const base = destFor(role, withPrompts);
    const search = `?role=${encodeURIComponent(role)}&room=${encodeURIComponent(
      room
    )}&invitee=${encodeURIComponent(invitee)}`;
    navigate(base + search);
  };

  const join = () => {
    if (!joinCode.trim()) return;
    const base = destFor(role, withPrompts);
    navigate(
      `${base}?role=${encodeURIComponent(role)}&room=${encodeURIComponent(
        joinCode.trim()
      )}`
    );
  };

  const copyRoom = async () => {
    try {
      await navigator.clipboard.writeText(room);
      setCopied(true);
      setTimeout(() => setCopied(false), 900);
    } catch {}
  };

  return (
    <div
      className={`min-h-screen ${BACKGROUND_COLOR} text-white grid grid-rows-[auto_1fr_auto] relative overflow-hidden font-quicksand`}
    >
      <GridOverlay />
      <LoggedInNavBar />

      {/* Gradient hero added here */}
      <section className="relative">
        <div
          className={`absolute inset-0 pointer-events-none opacity-20 ${ACCENT_GRADIENT}`}
        />
        <div className="relative max-w-5xl mx-auto w-full px-6 md:px-10 pt-10 pb-6">
          <h1 className="text-3xl font-audiowide tracking-wider mb-2">
            AI Interviewer
          </h1>
          <p className="text-gray-400 max-w-3xl">
            Host or join a collaborative coding interview between two people.
            One acts as the{" "}
            <span className="text-white font-medium">interviewer</span> and the
            other as the{" "}
            <span className="text-white font-medium">interviewee</span>.
            Includes a live code editor, timer, chat, and optional AI-suggested
            questions for the interviewer.
          </p>
        </div>
      </section>
      {/*  End gradient header */}

      <main className="max-w-5xl mx-auto w-full px-6 md:px-10 py-10 space-y-8 text-sm relative z-10">
        {/* Start Session */}
        <Panel title="Start a New Session">
          <div className="p-5 md:p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Role / Options */}
              <div
                className={`rounded-xl ${BORDER_COLOR} border ${FEATURE_BG} p-4 md:p-5`}
              >
                <p className="text-xs text-gray-400 mb-2">Choose your role</p>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value="interviewer"
                      checked={role === "interviewer"}
                      onChange={() => setRole("interviewer")}
                      className="accent-cyan-500"
                    />
                    <span>Interviewer</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value="interviewee"
                      checked={role === "interviewee"}
                      onChange={() => setRole("interviewee")}
                      className="accent-cyan-500"
                    />
                    <span>Interviewee</span>
                  </label>
                </div>

                <label
                  className={`flex items-center gap-2 mt-4 cursor-pointer text-xs ${
                    role === "interviewee" ? "opacity-60" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={withPrompts}
                    onChange={(e) => setWithPrompts(e.target.checked)}
                    disabled={role === "interviewee"}
                    className="accent-cyan-500"
                  />
                  <span>Enable AI-suggested questions (interviewer only)</span>
                </label>
              </div>

              {/* Invite + Code */}
              <div
                className={`rounded-xl ${BORDER_COLOR} border ${FEATURE_BG} p-4 md:p-5`}
              >
                <p className="text-xs text-gray-400 mb-2">
                  Invite a collaborator
                </p>
                <input
                  value={invitee}
                  onChange={(e) => setInvitee(e.target.value)}
                  placeholder="teammate@domain.com"
                  className={`w-full ${BACKGROUND_COLOR} ${BORDER_COLOR} border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/60`}
                />
                <div className="mt-4">
                  <p className="text-xs text-gray-400 mb-1">Session code</p>
                  <div className="flex items-center gap-2">
                    <div
                      className={`inline-flex items-center gap-2 ${FEATURE_BG} ${BORDER_COLOR} border rounded-lg px-3 py-1.5 text-base tracking-widest font-mono`}
                    >
                      {room}
                    </div>
                    <button
                      onClick={copyRoom}
                      className={`inline-flex items-center gap-1 rounded-lg ${BORDER_COLOR} border ${FEATURE_BG} px-2.5 py-1.5 text-xs hover:border-cyan-500 transition`}
                    >
                      <Copy className="h-3.5 w-3.5" />
                      {copied ? "Copied" : "Copy"}
                    </button>
                    <button
                      onClick={() => setRoom(genRoomCode())}
                      className={`inline-flex items-center gap-1 rounded-lg ${BORDER_COLOR} border ${FEATURE_BG} px-2.5 py-1.5 text-xs hover:border-cyan-500 transition`}
                    >
                      <RefreshCcw className="h-3.5 w-3.5" />
                      New
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={start}
                className={`inline-flex items-center gap-2 px-4 h-10 rounded-lg text-sm font-semibold transition shadow hover:brightness-110 ${ACCENT_GRADIENT}`}
              >
                Start Session
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => window.history.back()}
                className={`px-4 h-10 rounded-lg text-sm ${FEATURE_BG} ${BORDER_COLOR} border hover:border-cyan-500/60 transition`}
              >
                Cancel
              </button>
            </div>
          </div>
        </Panel>

        {/* Join Session */}
        <Panel title="Join an Existing Session">
          <div className="p-5 md:p-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                placeholder="Enter session code (e.g., 9ZK3LM)"
                className={`flex-1 ${BACKGROUND_COLOR} ${BORDER_COLOR} border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/60`}
              />
              <button
                onClick={join}
                className={`px-4 h-10 rounded-lg text-sm font-semibold transition shadow hover:brightness-110 ${ACCENT_GRADIENT}`}
              >
                Join
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-400">
              Tip: your teammate can share their session code from the Start
              screen.
            </p>
          </div>
        </Panel>
      </main>

      <Footer />
    </div>
  );
}
