const Todo = require('../models/Todo');

// 📥 Get all todos for the logged-in user
exports.getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id }).sort({ dueDate: 1 });
    res.status(200).json(todos);
  } catch (err) {
    console.error("❌ Error getting todos:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ➕ Create a new todo
exports.createTodo = async (req, res) => {
  const { title, dueDate } = req.body;

  if (!title || !dueDate) {
    return res.status(400).json({ message: 'Title and due date are required' });
  }

  try {
    const todo = await Todo.create({
      title,
      dueDate,
      user: req.user.id,
    });

    res.status(201).json(todo);
  } catch (error) {
    console.error('❌ Create todo error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✏️ Update a todo
exports.updateTodo = async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user.id });
    if (!todo) return res.status(404).json({ message: 'Todo not found' });

    Object.assign(todo, req.body);
    await todo.save();
    res.status(200).json(todo);
  } catch (err) {
    console.error("❌ Update todo error:", err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ❌ Delete a todo
exports.deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!todo) return res.status(404).json({ message: 'Todo not found' });

    res.status(200).json({ message: 'Todo deleted' });
  } catch (err) {
    console.error("❌ Delete todo error:", err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
