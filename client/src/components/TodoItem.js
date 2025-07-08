// src/components/TodoItem.js
import React from "react";
import { FaTrash, FaEdit, FaCheckCircle } from "react-icons/fa";
import moment from "moment";
import api from "../services/api";

const TodoItem = ({ todo, refreshTodos, setEditingTodo }) => {
  const dueDate = moment(todo.dueDate);
  const now = moment();
  const duration = moment.duration(dueDate.diff(now));
  const isOverdue = duration.asSeconds() < 0;

  const remainingTime = isOverdue
    ? "⏰ Overdue"
    : `${duration.hours()}h ${duration.minutes()}m ${duration.seconds()}s`;

  const cardBg = todo.completed ? "bg-success bg-opacity-25" : "bg-dark";
  const badge = todo.completed ? (
    <span className="badge bg-success">✔ Done</span>
  ) : isOverdue ? (
    <span className="badge bg-danger">Overdue</span>
  ) : (
    <span className="badge bg-warning text-dark">⏳ {remainingTime}</span>
  );

  // ✅ DELETE todo
  const handleDelete = async (id) => {
    try {
      await api.delete(`/todos/${id}`);
      refreshTodos();
    } catch (err) {
      console.error("Delete error:", err.message);
    }
  };

  // ✅ Toggle complete (PATCH)
  const handleToggleComplete = async (id) => {
    try {
      await api.put(`/todos/${id}`, { completed: !todo.completed });
      refreshTodos();
    } catch (err) {
      console.error("Toggle complete error:", err.message);
    }
  };

  return (
    <div
      className={`card ${cardBg} text-light mb-3 shadow-sm border-0`}
      style={{ animation: "fadeIn 0.4s ease-in-out" }}
    >
      <div className="card-body d-flex justify-content-between align-items-center">
        <div>
          <h5
            className={`card-title mb-1 ${
              todo.completed
                ? "text-decoration-line-through text-muted"
                : ""
            }`}
          >
            {todo.title}
          </h5>
          {todo.description && (
            <p className="card-text small mb-1 text-secondary">
              {todo.description}
            </p>
          )}
          <p className="card-text small mb-1">
            📅 Due: <strong>{dueDate.format("YYYY-MM-DD HH:mm")}</strong>
          </p>
          {badge}
        </div>

        <div className="d-flex gap-2">
          <button
            className="btn btn-sm btn-outline-info"
            title="Edit"
            onClick={() => setEditingTodo(todo)}
          >
            <FaEdit />
          </button>
          <button
            className="btn btn-sm btn-outline-danger"
            title="Delete"
            onClick={() => handleDelete(todo._id)}
          >
            <FaTrash />
          </button>
          <button
            className={`btn btn-sm ${
              todo.completed ? "btn-success" : "btn-outline-success"
            }`}
            title="Mark as Done"
            onClick={() => handleToggleComplete(todo._id)}
          >
            <FaCheckCircle />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoItem;
