// src/pages/CreateAccount.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/nav/NavBar";
import Footer from "../components/Footer";
import Button from "../components/Button"; // Primary Button component
import FormInput from "../components/FormInput.jsx"; // Reusable Input component
import {
  BACKGROUND_COLOR,
  ACCENT_GRADIENT,
  FEATURE_BG,
  BORDER_COLOR,
  GridOverlay,
} from "../utils/constants";

export default function CreateAccount() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const navigate = useNavigate();

  const showErrorMessage = (message) => {
    // Placeholder for real error handling (e.g., a toast notification)
    alert(message);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      showErrorMessage("Error: Passwords do not match.");
      return;
    }

    // Simulate account creation success
    console.log("Attempting account activation...");

    // Navigate to the Congratulations page
    setTimeout(() => {
      navigate("/congratulations");
    }, 500);
  };

  return (
    <div
      className={`min-h-screen ${BACKGROUND_COLOR} text-white relative overflow-hidden font-quicksand`}
    >
      <GridOverlay />

      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none z-0">
        <div className="absolute top-[-10rem] left-1/4 w-[50rem] h-[50rem] bg-fuchsia-500/10 rounded-full filter blur-3xl"></div>
      </div>

      <NavBar />

      {/* Header Divider */}
      <div className={`relative z-10 w-full mb-8`}>
        <div className={`h-[2px] bg-gray-700 opacity-70`}></div>
      </div>

      <main className="max-w-xl mx-auto px-6 py-12 relative z-10 flex-grow">
        <div
          className={`${FEATURE_BG} ${BORDER_COLOR} border rounded-2xl p-6 sm:p-10 shadow-2xl shadow-fuchsia-900/50`}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-audiowide tracking-widest mb-2 uppercase">
              <span
                className={`bg-clip-text text-transparent ${ACCENT_GRADIENT}`}
              >
                CREATE YOUR ACCOUNT
              </span>
            </h1>
            <p className="text-gray-400 text-sm font-light">
              Step into the future of job hunting — together.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="First Name"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First name"
              />
              <FormInput
                label="Last Name"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last name"
              />
            </div>

            <FormInput
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />

            <FormInput
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
            />
            <p className="text-gray-400 text-xs mt-2 font-light">
              Must be at least 8 characters with a number and special character
            </p>

            <FormInput
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
            />

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-3 pt-2">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className="w-4 h-4 text-fuchsia-500 bg-[#05001A] border-gray-600 rounded focus:ring-fuchsia-500 focus:ring-2 mt-1 transition duration-200"
                required
              />
              <label className="text-sm text-gray-300 font-light">
                I agree to the{" "}
                <a
                  href="#"
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Primary CTA Button */}
            <Button type="submit" widthClass="w-full">
              ACTIVATE ACCOUNT
            </Button>

            {/* Login Link */}
            <div className="text-center text-sm text-gray-400">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-fuchsia-400 hover:text-fuchsia-300 font-semibold transition-colors"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
