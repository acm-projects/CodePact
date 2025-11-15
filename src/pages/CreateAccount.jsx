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
import { authAPI } from "../utils/api";

export default function CreateAccount() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      showErrorMessage("Error: Passwords do not match.");
      return;
    }

    if (formData.password.length < 8) {
      showErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    if (!formData.agreeToTerms) {
      showErrorMessage("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

    setIsLoading(true);

    console.log("🟣 [SIGNUP FRONTEND] Signup form submitted");
    console.log("🟣 [SIGNUP FRONTEND] Form data:", {
      firstName: formData.firstName,
      email: formData.email,
      passwordLength: formData.password.length
    });

    try {
      // Use just the first name as per MongoDB schema
      const signupData = {
        name: formData.firstName.trim(),
        emailAddress: formData.email.trim(),
        password: formData.password,
      };
      
      console.log("🟣 [SIGNUP FRONTEND] Sending signup request with:", {
        name: signupData.name,
        emailAddress: signupData.emailAddress,
        passwordLength: signupData.password.length
      });

      const result = await authAPI.signup(signupData);

      console.log("🟣 [SIGNUP FRONTEND] Response received:");
      console.log("🟣 [SIGNUP FRONTEND] - Status:", result.status);
      console.log("🟣 [SIGNUP FRONTEND] - OK:", result.ok);
      console.log("🟣 [SIGNUP FRONTEND] - Data:", result.data);
      console.log("🟣 [SIGNUP FRONTEND] - Error:", result.error);

      if (result.ok && result.data.success) {
        console.log("✅ [SIGNUP FRONTEND] Signup successful!");
        if (result.data.user) {
          console.log("✅ [SIGNUP FRONTEND] User created:", {
            name: result.data.user.name,
            emailAddress: result.data.user.emailAddress,
            _id: result.data.user._id
          });
        }
        // Navigate to the Congratulations page on success
        navigate("/congratulations");
      } else {
        const errorMsg = result.error || result.data?.message || "Account creation failed. Please try again.";
        console.error("❌ [SIGNUP FRONTEND] Signup failed:", errorMsg);
        showErrorMessage(errorMsg);
      }
    } catch (err) {
      console.error("❌ [SIGNUP FRONTEND] Exception caught:", err);
      console.error("❌ [SIGNUP FRONTEND] Error details:", {
        message: err.message,
        stack: err.stack
      });
      showErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
      console.log("🟣 [SIGNUP FRONTEND] Signup attempt completed");
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
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="First Name"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First name"
                required
                disabled={isLoading}
              />
              <FormInput
                label="Last Name"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last name"
                required
                disabled={isLoading}
              />
            </div>

            <FormInput
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              disabled={isLoading}
            />

            <FormInput
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
              disabled={isLoading}
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
              required
              disabled={isLoading}
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
                disabled={isLoading}
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
            <Button type="submit" widthClass="w-full" disabled={isLoading}>
              {isLoading ? "CREATING ACCOUNT..." : "ACTIVATE ACCOUNT"}
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
