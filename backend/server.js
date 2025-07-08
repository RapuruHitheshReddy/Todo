const express = require("express");
const http = require("http");
const path = require("path");
const dotenv = require("dotenv");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const todoRoutes = require("./routes/todoRoutes");
const authRoutes = require("./routes/auth");
const checkReminders = require("./reminderChecker");

dotenv.config();
connectDB();
require("./config/passport")(passport);

const app = express();
const server = http.createServer(app);

// Middlewares
app.use(express.json());
app.use(cookieParser());

// ✅ Session Setup (no CORS cookies, all same-origin)
const store = MongoStore.create({
  mongoUrl: process.env.MONGO_URI,
  crypto: { secret: process.env.SESSION_SECRET || "fallbackSecret" },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => console.error("❌ MongoStore Error:", err));

app.use(
  session({
    store,
    name: "todoSession",
    secret: process.env.SESSION_SECRET || "fallbackSecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);

// Health Check
app.get("/api/health", (req, res) => {
  res.send("✅ Server is up and running.");
});

// ✅ Serve frontend in production
const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/client/build")));
  app.get("*", (req, res) =>
    res.sendFile(path.join(__dirname1, "/client/build/index.html"))
  );
}

// ✅ WebSocket (still uses same-origin — no need for CORS)
const io = new Server(server, {
  cors: {
    origin: false, // <- optional; not needed when frontend is same origin
    credentials: true,
  },
});

global._io = io;

io.on("connection", (socket) => {
  console.log("📡 Socket connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });
});

// Reminder Checker
setInterval(() => {
  console.log("⏰ Checking reminders at", new Date().toLocaleTimeString());
  checkReminders(io);
}, 1000);

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
