// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://mern-todo-reminder-8knm.onrender.com/api",
  withCredentials: true, // ✅ Send cookies (required for session auth)
});

export default api;
