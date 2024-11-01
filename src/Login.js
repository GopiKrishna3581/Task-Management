import React, { useState } from 'react';
import { auth } from './firebase';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const Login = ({ onLogin, toggleSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const provider = new GoogleAuthProvider();

  const handleGoogleLogin = async () => {
    try {
      // This will trigger the Google account selection if the user has multiple accounts
      const result = await signInWithPopup(auth, provider);
      const user = result.user; 
      onLogin(user); // Notify the parent component to update user state
      alert("Logged in with Google successfully!");
    } catch (error) {
      setError("Error logging in with Google: " + error.message);
    }
  };

  const handleEmailPasswordLogin = async (e) => {
    e.preventDefault();
    setError(''); 
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user; // Get user info from result
      alert("Logged in successfully!");
      onLogin(user); // Notify the parent component to update user state
    } catch (error) {
      console.error("Login error:", error);
      setError("Error logging in with email and password: " + error.message);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-4">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button 
          onClick={handleGoogleLogin} 
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200 mb-4"
        >
          Login with Google
        </button>
        <form onSubmit={handleEmailPasswordLogin}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="border border-gray-300 p-2 rounded w-full mb-4"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="border border-gray-300 p-2 rounded w-full mb-4"
          />
          <button 
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
          >
            Login
          </button>
        </form>
        <button onClick={toggleSignUp} className="text-blue-500 mt-2">
          Don't have an account? Sign Up
        </button>
      </div>
    </div>
  );
};

export default Login;
