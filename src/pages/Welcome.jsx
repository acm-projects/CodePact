// src/pages/Welcome.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import Button from "../components/Button";
import {
  BACKGROUND_COLOR,
  ACCENT_GRADIENT,
  FEATURE_BG,
  GridOverlay,
} from "../utils/constants";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div
      className={`min-h-screen ${BACKGROUND_COLOR} text-white relative overflow-hidden flex flex-col`}
    >
      <GridOverlay />

      {/* Background glow */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none z-0">
        <div className="absolute top-[-10rem] left-1/4 w-[50rem] h-[50rem] bg-fuchsia-500/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-[-5rem] right-1/4 w-[40rem] h-[40rem] bg-cyan-500/10 rounded-full filter blur-3xl"></div>
      </div>

      <Navbar />

      {/* Hero Section */}
      <div className="flex-grow flex items-center justify-center relative z-10 px-6 py-28 md:py-40 text-center">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight uppercase font-audiowide">
            YOUR{" "}
            <span
              className={`bg-clip-text text-transparent ${ACCENT_GRADIENT} mx-2`}
            >
              COLLABORATIVE
            </span>
            <br />
            JOB HUNT STARTS HERE.
          </h1>

          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mt-8 tracking-wide font-light font-quicksand">
            CodePact transforms the isolated tech job hunt into a collaborative,
            team-oriented experience. Form squads, share resources, and
            accelerate your collective path to success.
          </p>

          {/* CTA Buttons */}
          <div className="flex justify-center gap-8 mt-12">
            <Button
              onClick={() => navigate("/create-account")}
              widthClass="px-10 py-3 text-lg"
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
                className={`block ${FEATURE_BG} text-white font-semibold font-quicksand tracking-widest px-10 py-3 rounded-[5px]`}
              >
                LOGIN
              </span>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}