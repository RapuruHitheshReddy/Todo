// src/pages/Login.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import API from "../services/api";

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/auth/login", form, {
        withCredentials: true, // ✅ Ensures cookie works
      });

      if (res.status === 200) {
        toast.success("✅ Logged in successfully");

        // Confirm session login
        if (typeof onLogin === "function") {
          await onLogin(); // Will call GET /auth/me
        }

        navigate("/");
      } else {
        toast.error("Login failed");
      }
    } catch (err) {
      console.error("❌ Login error:", err?.response || err.message);
      toast.error(
        err?.response?.data?.message || "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "90vh" }}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="card p-5 w-100" style={{ maxWidth: "400px" }}>
        <h3 className="text-center mb-4">
          <i className="bi bi-box-arrow-in-right me-2 text-primary" />
          Login
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              name="email"
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Password</label>
            <input
              name="password"
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 rounded-3"
            disabled={loading}
          >
            <i className="bi bi-arrow-right-circle me-2" />
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-center mt-3">
          <small>
            Don’t have an account?{" "}
            <Link to="/register" className="text-decoration-underline">
              Register
            </Link>
          </small>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;
