import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc, getDoc } from 'firebase/firestore';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import Login from './Login';
import SignUp from './SignUp';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [user, setUser] = useState(null);
  const [showSignUp, setShowSignUp] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return;

      const tasksCollection = collection(db, 'tasks');
      const taskSnapshot = await getDocs(tasksCollection);
      const taskList = taskSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(task => task.uid === user.uid);
      setTasks(taskList);
    };

    fetchTasks();
  }, [user]);

  const addTask = async (newTask) => {
    if (!user) return;
    try {
      const tasksCollection = collection(db, 'tasks');
      const docRef = await addDoc(tasksCollection, { ...newTask, uid: user.uid });
      setTasks([...tasks, { id: docRef.id, ...newTask, uid: user.uid }]);
    } catch (error) {
      console.error("Error adding task: ", error.message);
    }
  };

  const editTask = async (taskId, updatedTask) => {
    try {
      const taskDoc = doc(db, 'tasks', taskId);
      const taskData = (await getDoc(taskDoc)).data();
      if (taskData.uid !== user.uid) throw new Error("Not authorized to edit this task");

      await updateDoc(taskDoc, updatedTask);
      setTasks(tasks.map(task => (task.id === taskId ? { ...task, ...updatedTask } : task)));
    } catch (error) {
      console.error("Error updating task: ", error.message);
    }
  };

  const removeTask = async (taskId) => {
    try {
      const taskDoc = doc(db, 'tasks', taskId);
      const taskData = (await getDoc(taskDoc)).data();
      if (taskData.uid !== user.uid) throw new Error("Not authorized to delete this task");

      await deleteDoc(taskDoc);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting task: ", error.message);
    }
  };

  const toggleComplete = (taskId, completed) => {
    const updatedTask = { completed: !completed };
    editTask(taskId, updatedTask);
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || task.priority === filter;
    return matchesSearch && matchesFilter;
  });

  const handleLogin = (user) => {
    setUser(user);
  };

  const handleLogout = () => {
    auth.signOut().then(() => setUser(null));
  };

  const toggleSignUp = () => {
    setShowSignUp(!showSignUp);
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold my-4">Task Manager</h1>
      {user ? (
        <>
          <h2 className="text-xl">Welcome, {user.email || user.displayName}</h2> {/* Display user email or name */}
          <button onClick={handleLogout} className="bg-red-500 text-white p-2 rounded">Logout</button>
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 mb-4 w-full"
          />
          <select onChange={(e) => setFilter(e.target.value)} value={filter} className="border p-2 mb-4">
            <option value="all">All</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <TaskForm addTask={addTask} />
          <TaskList 
            tasks={filteredTasks} 
            removeTask={removeTask} 
            toggleComplete={toggleComplete} 
            editTask={editTask} 
          />
        </>
      ) : (
        <>
          {showSignUp ? (
            <SignUp onSignUp={handleLogin} toggleSignUp={toggleSignUp} />
          ) : (
            <Login onLogin={handleLogin} toggleSignUp={toggleSignUp} />
          )}
        </>
      )}
    </div>
  );
};

export default App;
