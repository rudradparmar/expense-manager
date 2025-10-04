import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Signup.css";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country: "",
    password: "",
    confirmPassword: "",
    role: "Employee",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      const result = await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        country: formData.country,
        role: formData.role,
      });

      if (result.success) {
        const { role } = result.user;
        switch (role) {
          case "Admin":
            navigate("/admin/dashboard");
            break;
          case "Manager":
            navigate("/manager/dashboard");
            break;
          case "Employee":
            navigate("/employee/dashboard");
            break;
          default:
            navigate("/employee/dashboard");
        }
      } else {
        setError(result.error || "Signup failed");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="viewport-center">
      <div className="center-content-limit narrow">
        <div className="main-wrapper">
          {/* Header */}
          <div className="header animate-fade-in-up" style={{ textAlign: "center" }}>
            <div className="logo-container" style={{ margin: "0 auto" }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
            </div>
            <h1 className="header-title font-cyber glow-text">JOIN THE FUTURE</h1>
            <p className="header-subtitle">Create your account to get started</p>
          </div>

          {/* Form */}
          <div className="cyber-card animate-fade-in-up" style={{ animationDelay: "0.1s", margin: "0 auto", maxWidth: "560px" }}>
            {error && (
              <div style={{ color: "#ff4444", marginBottom: "1rem", textAlign: "center" }}>
                {error}
              </div>
            )}
            <form className="auth-form" onSubmit={handleSubmit}>
              {/* Name */}
              <div>
                <label className="form-label" htmlFor="name">Full Name</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter your full name"
                    required
                    className="form-input"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="form-label" htmlFor="email">Email Address</label>
                <div className="input-wrapper">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    required
                    className="form-input"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Country */}
              <div>
                <label className="form-label" htmlFor="country">Country</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="country"
                    name="country"
                    placeholder="Enter your country"
                    required
                    className="form-input"
                    value={formData.country}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="form-label" htmlFor="role">Role</label>
                <div className="input-wrapper">
                  <select
                    id="role"
                    name="role"
                    className="form-input"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="Employee">Employee</option>
                    <option value="Manager">Manager</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="form-label" htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    required
                    className="form-input password-field"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="toggle-password-btn"
                    tabIndex={-1}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-wrapper">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    required
                    className="form-input password-field"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="toggle-password-btn"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button type="submit" className="neon-button" disabled={loading}>
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <div className="toggle-container" style={{ textAlign: "center" }}>
              <Link to="/" className="toggle-link">
                Already have an account? Sign in
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div className="footer animate-fade-in" style={{ animationDelay: "0.3s", textAlign: "center" }}>
            <p>Trusted • Secure • Fast</p>
          </div>
        </div>
      </div>
    </div>
  );
}
