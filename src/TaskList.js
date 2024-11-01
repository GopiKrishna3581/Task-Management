// src/TaskList.js
import React, { useState, useEffect } from 'react';

const TaskList = ({ tasks, removeTask, toggleComplete, editTask }) => {
  const [isEditing, setIsEditing] = useState(null);
  const [editedTask, setEditedTask] = useState({ text: '', dueDate: '', priority: '' });

  useEffect(() => {
    if (isEditing !== null) {
      const taskToEdit = tasks.find(task => task.id === isEditing);
      if (taskToEdit) {
        setEditedTask(taskToEdit);
      }
    }
  }, [isEditing, tasks]);

  const handleEditClick = (taskId) => {
    setIsEditing(taskId);
  };

  const handleSaveEdit = () => {
    if (editedTask.text.trim() === '') {
      alert('Task text cannot be empty.');
      return;
    }
    editTask(editedTask.id, editedTask); // Call editTask to update Firestore
    setIsEditing(null); // Exit editing mode
    setEditedTask({ text: '', dueDate: '', priority: '' }); // Reset edit state
  };

  const handleRemoveTask = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      removeTask(taskId); // Call removeTask to delete from Firestore
    }
  };

  return (
    <ul>
      {tasks.sort((a, b) => (b.priority === 'high' ? 1 : b.priority === 'medium' ? 0 : -1)).map((task) => (
        <li key={task.id} className={`flex justify-between items-center mb-4 p-4 border rounded ${task.priority === 'high' ? 'bg-red-100' : task.priority === 'medium' ? 'bg-yellow-100' : 'bg-green-100'}`}>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleComplete(task.id, task.completed)}
              className="mr-2"
            />
            {isEditing === task.id ? (
              <>
                <input
                  type="text"
                  value={editedTask.text}
                  onChange={(e) => setEditedTask({ ...editedTask, text: e.target.value })}
                  className="border p-2 rounded mr-2 flex-grow"
                  placeholder="Task description"
                />
                <input
                  type="date"
                  value={editedTask.dueDate}
                  onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
                  className="border p-2 rounded mr-2"
                />
                <select
                  value={editedTask.priority}
                  onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value })}
                  className="border p-2 rounded mr-2"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <button onClick={handleSaveEdit} className="bg-teal-600 text-white px-4 py-2 rounded">Save</button>
              </>
            ) : (
              <>
                <span className={task.completed ? 'line-through' : ''}>{task.text}</span>
                <span className="mr-4">Due: {task.dueDate}</span>
                <span className={`font-bold ${task.priority === 'high' ? 'text-red-600' : task.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'}`}>{task.priority}</span>
                <button onClick={() => handleEditClick(task.id)} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">Edit</button>
                <button onClick={() => handleRemoveTask(task.id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
              </>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TaskList;
