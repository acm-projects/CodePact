// src/pages/CreateAccount.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import NavBar from "../components/NavBar.jsx";
import Footer from "../components/Footer.jsx";
import Button from "../components/Button.jsx";
import FormInput from "../components/FormInput.jsx";
import {
  BACKGROUND_COLOR, ACCENT_GRADIENT, FEATURE_BG, BORDER_COLOR, GridOverlay,
} from "../utils/constants.jsx";

export default function CreateAccount() {
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "",
    password: "", confirmPassword: "", agreeToTerms: false
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const showErrorMessage = (message) => setError(message);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.agreeToTerms) {
      return showErrorMessage("Please agree to the Terms and Privacy Policy.");
    }
    if (formData.password !== formData.confirmPassword) {
      return showErrorMessage("Passwords do not match.");
    }
    if (formData.password.length < 8) {
      return showErrorMessage("Password must be at least 8 characters.");
    }

    const name = `${formData.firstName} ${formData.lastName}`.trim();

    try {
      setLoading(true);
      const res = await fetch("/api/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        const msg =
          data?.errors?.[0]?.msg ||
          (Array.isArray(data?.errors) ? JSON.stringify(data.errors) : data?.message) ||
          "Registration failed. Please check your details.";
        throw new Error(msg);
      }

      // ✅ Success: send them to Login to sign in
      navigate("/login");

      // 🔄 (Optional auto-login):
      // localStorage.setItem("cp_token", data.token);
      // localStorage.setItem("cp_user", JSON.stringify(data.user));
      // navigate("/leaderboard");
    } catch (err) {
      showErrorMessage(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${BACKGROUND_COLOR} text-white relative overflow-hidden font-quicksand`}>
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
        <div className={`${FEATURE_BG} ${BORDER_COLOR} border rounded-2xl p-6 sm:p-10 shadow-2xl shadow-fuchsia-900/50`}>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-audiowide tracking-widest mb-2 uppercase">
              <span className={`bg-clip-text text-transparent ${ACCENT_GRADIENT}`}>CREATE YOUR ACCOUNT</span>
            </h1>
            <p className="text-gray-400 text-sm font-light">
              Step into the future of job hunting — together.
            </p>
          </div>

          {/* Error banner */}
          {error && (
            <div className="text-sm rounded-md p-3 mb-4 border border-red-700/40 bg-red-900/30 text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormInput label="First Name" type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First name" />
              <FormInput label="Last Name" type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last name" />
            </div>

            <FormInput label="Email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" />

            <FormInput label="Password" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Create a password" />
            <p className="text-gray-400 text-xs mt-2 font-light">
              Must be at least 8 characters (we recommend adding a number and special character).
            </p>

            <FormInput label="Confirm Password" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm your password" />

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
                <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">Terms of Service</a>{" "}
                and{" "}
                <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">Privacy Policy</a>
              </label>
            </div>

            <Button type="submit" widthClass="w-full" disabled={loading}>
              {loading ? "CREATING..." : "ACTIVATE ACCOUNT"}
            </Button>

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
