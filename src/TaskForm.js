// src/TaskForm.js
import React, { useState } from 'react';

const TaskForm = ({ addTask }) => {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState('low');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text) return; // Prevent adding empty tasks
    const newTask = { text, priority, dueDate, completed: false }; // Create new task object
    addTask(newTask); // Call addTask from App.js
    setText(''); // Reset input fields
    setPriority('low');
    setDueDate('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center mb-6 p-4 bg-white shadow-md rounded-lg">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Task description"
        className="border border-gray-300 p-3 rounded-lg mb-4 md:mb-0 mr-0 md:mr-4 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="border border-gray-300 p-3 rounded-lg mb-4 md:mb-0 mr-0 md:mr-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="border border-gray-300 p-3 rounded-lg mb-4 md:mb-0 mr-0 md:mr-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-3 rounded-lg transition duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        Add Task
      </button>
    </form>
  );
};

export default TaskForm;
