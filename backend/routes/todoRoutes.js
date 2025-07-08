const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} = require("../controllers/todoController");

// 🔒 Protect all routes
router.use(authMiddleware);

// 📥 GET all todos for current user
router.get("/", getTodos);

// ➕ Create a new todo
router.post("/", createTodo);

// ✏️ Update existing todo
router.put("/:id", updateTodo);

// ❌ Delete a todo
router.delete("/:id", deleteTodo);

module.exports = router;
