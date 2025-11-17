// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Components
import Navbar from "../components/nav/NavBar";
import Footer from "../components/Footer";
import Button from "../components/Button";
import FormInput from "../components/FormInput";

// Styles & Utilities
import {
  BACKGROUND_COLOR,
  ACCENT_GRADIENT,
  FEATURE_BG,
  BORDER_COLOR,
  GridOverlay,
} from "../utils/constants";

import { useAuth } from "../context/AuthContext";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // 1) Real password-based sign-in
      const signInRes = await fetch(`${API_BASE}/api/sign-in`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const signInData = await signInRes.json();

      if (!signInRes.ok || !signInData.success) {
        const msg =
          signInData?.errors?.[0]?.msg ||
          signInData?.message ||
          "Invalid email or password";
        setError(msg);
        setIsSubmitting(false);
        return;
      }

      const signedInUser = signInData.user || {
        id: signInData.id,
        email,
        name: null,
      };

      // 2) Refresh cookie /cp_jwt via dev-login so /auth/me & sockets see the right user
      const devLoginRes = await fetch(`${API_BASE}/api/auth/dev-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email,
          name: signedInUser.name || email.split("@")[0],
        }),
      });

      const devLoginData = await devLoginRes.json();
      if (!devLoginRes.ok || !devLoginData.success) {
        console.warn("dev-login failed, but sign-in succeeded:", devLoginData);
        // We still continue, but /auth/me might be wrong until refresh
      }

      // 3) Update AuthContext with the best user data we have
      const authUser =
        devLoginData.data ||
        devLoginData.user || {
          _id: signedInUser.id,
          email,
          name: signedInUser.name,
        };

      setUser(authUser);

      // 4) Navigate to leaderboard
      navigate("/leaderboard");
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`min-h-screen ${BACKGROUND_COLOR} text-white relative overflow-hidden font-quicksand flex flex-col`}
    >
      {/* Grid overlay for subtle background lines */}
      <GridOverlay />

      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none z-0">
        <div className="absolute top-[-10rem] left-1/4 w-[50rem] h-[50rem] bg-fuchsia-500/10 rounded-full filter blur-3xl" />
      </div>

      {/* Global NavBar (centered CODEPACT) */}
      <Navbar />

      {/* Login Card */}
      <main className="max-w-xl mx-auto px-6 py-10 md:py-14 relative z-10 flex-grow">
        <div
          className={`${FEATURE_BG} ${BORDER_COLOR} border rounded-2xl p-6 sm:p-10 shadow-2xl shadow-fuchsia-900/50`}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">CodePact</h1>
            <h2 className="text-lg text-gray-300 mb-1">
              Login to Your Account
            </h2>
            <p className="text-gray-400 text-sm">
              Continue your collaborative tech job hunt.
            </p>
            <h1
              className={`text-3xl font-audiowide tracking-widest mb-2 uppercase bg-clip-text text-transparent ${ACCENT_GRADIENT}`}
            >
              SQUAD LOGIN
            </h1>
            <p className="text-gray-400 text-sm font-light">
              Access your collaborative job hunt dashboard.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 text-sm text-red-400 text-center">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormInput
              label="Email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter login email"
            />

            <FormInput
              label="Password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />

            <div className="flex items-center justify-between text-sm pt-2">
              <label className="flex items-center text-gray-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-fuchsia-500 bg-[#05001A] border-gray-600 rounded focus:ring-fuchsia-500 focus:ring-2 transition duration-200"
                />
                <span className="ml-2 font-light">Remember me</span>
              </label>
              <a
                href="#"
                className="text-cyan-400 hover:text-cyan-300 transition-colors font-light"
              >
                Forgot password?
              </a>
            </div>

            {/* Log In Button */}
            <Button
              type="submit"
              widthClass="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "LOGGING IN..." : "LOG IN"}
            </Button>

            {/* Sign Up Link */}
            <div className="text-center text-sm text-gray-400">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/create-account")}
                className="text-fuchsia-400 hover:text-fuchsia-300 font-semibold transition-colors"
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
