
import React, { useState } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragOverTaskId, setDragOverTaskId] = useState(null);
  const [popupTaskId, setPopupTaskId] = useState(null);
  const [editTaskId, setEditTaskId] = useState(null);
  const [editText, setEditText] = useState("");

  const addTask = () => {
    if (input.trim()) {
      setTasks([
        ...tasks,
        { id: Date.now(), text: input, status: "todo" }
      ]);
      setInput("");
    }
  };

  const onDragStart = (e, taskId) => {
    setDraggedTask(taskId);
  };

  const onDragOver = (e, overTaskId) => {
    e.preventDefault();
    if (draggedTask !== overTaskId) {
      setDragOverTaskId(overTaskId);
    }
  };

  const onDrop = (e, status) => {
    e.preventDefault();

    if (!dragOverTaskId) {
      setTasks(prev =>
        prev.map(task =>
          task.id === draggedTask ? { ...task, status } : task
        )
      );
    } else {
     
      const current = tasks.find(t => t.id === draggedTask);
      const over = tasks.find(t => t.id === dragOverTaskId);

      if (current.status === over.status) {
        const filtered = tasks.filter(t => t.id !== draggedTask);
        const targetIndex = filtered.findIndex(t => t.id === dragOverTaskId);
        filtered.splice(targetIndex, 0, current);
        setTasks(filtered);
      } else {
        setTasks(prev =>
          prev.map(task =>
            task.id === draggedTask ? { ...task, status } : task
          )
        );
      }
    }

    setDraggedTask(null);
    setDragOverTaskId(null);
  };

  const onDeleteDrop = () => {
    setPopupTaskId(draggedTask);
    setDraggedTask(null);
  };

  const confirmDelete = () => {
    setTasks(tasks.filter(t => t.id !== popupTaskId));
    setPopupTaskId(null);
  };

  const cancelDelete = () => {
    setPopupTaskId(null);
  };

  const onEdit = (taskId, currentText) => {
    setEditTaskId(taskId);
    setEditText(currentText);
  };

  const saveEdit = () => {
    setTasks(prev =>
      prev.map(task =>
        task.id === editTaskId ? { ...task, text: editText } : task
      )
    );
    setEditTaskId(null);
  };

  const renderTasks = status =>
    tasks
      .filter(task => task.status === status)
      .map(task => (
        <div
          key={task.id}
          className="task"
          draggable
          onDragStart={e => onDragStart(e, task.id)}
          onDragOver={e => onDragOver(e, task.id)}
          onDrop={e => onDrop(e, status)}
          onDoubleClick={() => onEdit(task.id, task.text)}
        >
          {editTaskId === task.id ? (
            <input
              autoFocus
              className="edit-input"
              value={editText}
              onChange={e => setEditText(e.target.value)}
              onBlur={saveEdit}
              onKeyDown={e => e.key === "Enter" && saveEdit()}
            />
          ) : (
            task.text
          )}
        </div>
      ));

  return (
    <div className="kanban-container">
      <h2>Kanban Board</h2>
      <div className="task-input">
        <input
          placeholder="Add new task..."
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button onClick={addTask}>Add</button>
      </div>

      <div className="columns">
        {["todo", "progress", "done"].map(status => (
          <div
            key={status}
            className={`column ${status}`}
            onDragOver={e => e.preventDefault()}
            onDrop={e => onDrop(e, status)}
          >
            <h3>
              {status === "todo"
                ? "To Do 🤔 "
                : status === "progress"
                ? "In Progress ⚒️"
                : "Done 😎"}
            </h3>
            {renderTasks(status)}
          </div>
        ))}
      </div>

      <div
        className="delete-box"
        onDragOver={e => e.preventDefault()}
        onDrop={onDeleteDrop}
      >
        🗑️ Delete
      </div>

      {popupTaskId !== null && (
        <div className="popup-overlay">
          <div className="popup">
            <p>Are you sure you want to delete this task?</p>
            <button className="yes" onClick={confirmDelete}>
              Yes
            </button>
            <button className="no" onClick={cancelDelete}>
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

