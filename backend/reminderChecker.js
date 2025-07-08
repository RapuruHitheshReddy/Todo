const Todo = require('./models/Todo');

// 🧠 In-memory map to avoid duplicate reminders
const lastRemindedMap = new Map();

const checkReminders = async (io) => {
  const now = new Date();
  const inTenMinutes = new Date(now.getTime() + 10 * 60 * 1000);

  try {
    const todosToRemind = await Todo.find({
      dueDate: { $lte: inTenMinutes, $gt: now },
      completed: false,
    });

    for (const todo of todosToRemind) {
      const todoId = todo._id.toString();
      const lastRemindedAt = lastRemindedMap.get(todoId);

      // ⏱️ Skip if already reminded in last 60 seconds
      if (!lastRemindedAt || now - lastRemindedAt > 60 * 1000) {
        console.log(`⏰ Reminder: '${todo.title}' is due soon at ${todo.dueDate.toLocaleString()}`);

        io.emit('reminder', {
          id: todo._id,
          title: todo.title,
          dueDate: todo.dueDate,
        });

        lastRemindedMap.set(todoId, now);
      }
    }
  } catch (err) {
    console.error('❌ Error checking reminders:', err.message);
  }
};

module.exports = checkReminders;
