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

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const showErrorMessage = (message) => {
    setError(message);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      showErrorMessage("Error: Passwords do not match.");
      return;
    }

    if (!formData.agreeToTerms) {
      showErrorMessage(
        "You must agree to the Terms of Service and Privacy Policy."
      );
      return;
    }

    const fullName = `${formData.firstName} ${formData.lastName}`.trim();

    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Backend expects: { email, password, name, fullname }
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: fullName,
          fullname: fullName,
        }),
      });

      let data = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      console.log("create-user response:", res.status, data);

      if (!res.ok || !data.success) {
        // Try to pull a useful message from various shapes
        const firstErrorFromArray =
          data?.errors && Array.isArray(data.errors) && data.errors.length > 0
            ? data.errors[0].msg || JSON.stringify(data.errors[0])
            : null;

        const message =
          firstErrorFromArray ||
          data?.message ||
          (typeof data === "string" ? data : null) ||
          "Unable to create account. Please check your details.";

        showErrorMessage(message);
        setIsLoading(false);
        return;
      }

      // Store user/token if you want to auto-log in later
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // Redirect to Congratulations page on successful signup
      navigate("/congratulations");
    } catch (err) {
      console.error("Create account error:", err);
      showErrorMessage("Something went wrong. Please try again.");
      setIsLoading(false);
    }
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
      <div className="relative z-10 w-full mb-8">
        <div className="h-[2px] bg-gray-700 opacity-70"></div>
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

            {/* Error message */}
            {error && (
              <p className="text-sm text-red-400 text-center">{error}</p>
            )}

            {/* Primary CTA Button */}
            <Button type="submit" widthClass="w-full" disabled={isLoading}>
              {isLoading ? "ACTIVATING..." : "ACTIVATE ACCOUNT"}
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
