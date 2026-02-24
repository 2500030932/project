import React, { useState } from "react";
import "./App.css";

function Login({ setIsAuthenticated }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError("");
  };

  // Basic email validation
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Handle Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    if (!isValidEmail(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsAuthenticated(true); // Accept any credentials
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2>Login to Your Account</h2>

        {error && (
          <div className="alert-error" role="alert">
            {error}
          </div>
        )}

        <form className="form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter any email"
            value={formData.email}
            onChange={handleChange}
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter any password"
            value={formData.password}
            onChange={handleChange}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;