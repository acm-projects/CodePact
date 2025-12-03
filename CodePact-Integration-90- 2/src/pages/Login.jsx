// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Footer from "../components/Footer";
import Button from "../components/Button";
import FormInput from "../components/FormInput";

import {
  BACKGROUND_COLOR,
  ACCENT_GRADIENT,
  FEATURE_BG,
  BORDER_COLOR,
  GridOverlay,
} from "../utils/constants";

import { authAPI } from "../utils/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const loginData = { emailAddress: email, password };

      console.log("🔵 Sending login request:", loginData);

      // FIXED HERE ↓↓↓↓↓↓↓
      const result = await authAPI.login(loginData);

      console.log("🔵 Login response:", result);

      if (result.ok && result.data?.success) {
        console.log("✅ Login success:", result.data);
        navigate("/leaderboard");
      } else {
        setError(result.data?.message || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("❌ Login exception:", err);
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${BACKGROUND_COLOR} text-white relative overflow-hidden font-quicksand flex flex-col`}>
      <GridOverlay />

      <header className="relative z-10 w-full">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 ${ACCENT_GRADIENT} rounded-md flex items-center justify-center`}>
              <span className="font-bold">CP</span>
            </div>
            <span className="font-audiowide tracking-wide">CodePact</span>
          </div>
          <button type="button" onClick={() => navigate("/create-account")} className="text-sm text-cyan-300 hover:text-cyan-200">
            Create account
          </button>
        </div>
        <div className="h-[2px] bg-gray-700 opacity-70" />
      </header>

      <main className="max-w-xl mx-auto px-6 py-12 relative z-10 flex-grow">
        <div className={`${FEATURE_BG} ${BORDER_COLOR} border rounded-2xl p-6 sm:p-10 shadow-2xl shadow-fuchsia-900/50`}>
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">CodePact</h1>
            <h2 className="text-lg text-gray-300 mb-1">Login to Your Account</h2>
            <p className="text-gray-400 text-sm">Continue your collaborative tech job hunt.</p>
            <h1 className={`text-3xl font-audiowide tracking-widest mb-2 uppercase bg-clip-text text-transparent ${ACCENT_GRADIENT}`}>
              SQUAD LOGIN
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-sm text-red-400">{error}</div>
            )}

            <FormInput
              label="Email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter login email"
              required
              disabled={isLoading}
            />

            <FormInput
              label="Password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={isLoading}
            />

            <div className="flex items-center justify-between text-sm pt-2">
              <label className="flex items-center text-gray-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-fuchsia-500 bg-[#05001A] border-gray-600 rounded"
                />
                <span className="ml-2 font-light">Remember me</span>
              </label>
            </div>

            <Button type="submit" widthClass="w-full" disabled={isLoading}>
              {isLoading ? "LOGGING IN..." : "LOG IN"}
            </Button>

            <div className="text-center text-sm text-gray-400">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/create-account")}
                className="text-fuchsia-400 hover:text-fuchsia-300 font-semibold"
              >
                Create a new one
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
