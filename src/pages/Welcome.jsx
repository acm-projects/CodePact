// src/pages/Welcome.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

// Use ONE navbar import — this path matches your new structure
import Navbar from "../components/nav/NavBar";

import Footer from "../components/Footer";
import Button from "../components/Button";

import {
  BACKGROUND_COLOR,
  ACCENT_GRADIENT,
  FEATURE_BG,
  BORDER_COLOR,
  GridOverlay,
} from "../utils/constants";

export default function Welcome() {
  const navigate = useNavigate();

  const features = [
    {
      icon: "👥",
      title: "FORM SQUADS",
      description:
        "Instantly team up with friends to create your job-hunting squad. Divide and conquer challenges, share wins, and stay accountable.",
    },
    {
      icon: "📚",
      title: "SHARED RESOURCES",
      description:
        "Access a curated library of coding problems, interview guides, and resume templates. Build your shared knowledge base.",
    },
    {
      icon: "🏆",
      title: "LIVE FEED & LEADERBOARDS",
      description:
        "Stay motivated with real-time squad updates and competitive leaderboards. Celebrate every milestone together.",
    },
  ];

  return (
    <div
      className={`min-h-screen ${BACKGROUND_COLOR} text-white relative overflow-hidden`}
    >
      <GridOverlay />

      {/* Background glow */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none z-0">
        <div className="absolute top-[-10rem] left-1/4 w-[50rem] h-[50rem] bg-fuchsia-500/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-[-5rem] right-1/4 w-[40rem] h-[40rem] bg-cyan-500/10 rounded-full filter blur-3xl"></div>
      </div>

      {/* Top nav */}
      <Navbar />

      {/* Full-width divider */}
      <div className="relative z-10 w-full mb-12">
        <div className="h-[2px] bg-gray-700 opacity-70"></div>
      </div>

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <section className="text-center mb-8">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight uppercase font-audiowide">
              YOUR{" "}
              <span
                className={`bg-clip-text text-transparent ${ACCENT_GRADIENT} mx-2`}
              >
                COLLABORATIVE
              </span>
              <br />
              JOB HUNT STARTS HERE.
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mt-6 tracking-wide font-light font-quicksand">
              CodePact transforms the isolated tech job hunt into a
              collaborative, team-oriented experience. Form squads, share
              resources, and accelerate your collective path to success.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex justify-center gap-6">
            <Button
              onClick={() => navigate("/create-account")}
              widthClass="px-8"
            >
              CREATE ACCOUNT
            </Button>

            <div
              onClick={() => navigate("/login")}
              className={`relative p-[2px] rounded-lg cursor-pointer transform transition-all duration-300 hover:scale-[1.02] ${ACCENT_GRADIENT}`}
              role="button"
              tabIndex={0}
            >
              <span
                className={`block ${FEATURE_BG} text-white font-semibold font-quicksand tracking-widest px-8 py-3 rounded-[5px]`}
              >
                LOGIN
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* Divider */}
      <div className="relative z-10 w-full mb-16">
        <div className="h-[2px] bg-gray-700 opacity-70"></div>
      </div>

      {/* Features */}
      <main className="max-w-7xl mx-auto px-6 pt-0 pb-16 relative z-10">
        <section
          className={`${FEATURE_BG} rounded-3xl p-6 sm:p-12 border ${BORDER_COLOR} shadow-inner shadow-fuchsia-900/50`}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-white font-audiowide tracking-widest uppercase">
              FEATURES BUILT FOR SUCCESS
            </h2>
            <p className="text-lg text-gray-400 font-light font-quicksand">
              Give your squad the tools and structure they need to land the job
              with confidence.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className={`${FEATURE_BG} rounded-2xl p-8 transition-all duration-500 border border-gray-800 hover:border-fuchsia-500/50 hover:shadow-2xl hover:shadow-fuchsia-900/40 hover:-translate-y-1`}
              >
                <div
                  className={`text-5xl mb-6 bg-clip-text text-transparent ${ACCENT_GRADIENT}`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 text-white font-quicksand tracking-wide">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed font-light font-quicksand">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
