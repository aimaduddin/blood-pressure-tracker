import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { auth } from './firebase';
import BloodPressureList from './components/BloodPressureList';
import BloodPressureForm from './components/BloodPressureForm';
import BloodPressureGraphs from './components/BloodPressureGraphs';
import Login from './components/Login';
import Signup from './components/Signup';
import './App.css';

function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
}

function App() {
  const { currentUser } = useAuth();

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <nav className="bg-white shadow-lg">
            <div className="max-w-6xl mx-auto px-4">
              <div className="flex justify-between">
                <div className="flex space-x-7">
                  <div>
                    <Link to="/" className="flex items-center py-4 px-2">
                      <span className="font-semibold text-gray-500 text-lg">BP Tracker</span>
                    </Link>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {currentUser ? (
                    <>
                      <Link to="/" className="py-2 px-2 font-medium text-gray-500 rounded hover:bg-green-500 hover:text-white transition duration-300">Home</Link>
                      <Link to="/graphs" className="py-2 px-2 font-medium text-gray-500 rounded hover:bg-blue-500 hover:text-white transition duration-300">Graphs</Link>
                      <Link to="/add" className="py-2 px-2 font-medium text-white bg-green-500 rounded hover:bg-green-400 transition duration-300">Add</Link>
                      <button onClick={() => auth.signOut()} className="py-2 px-2 font-medium text-gray-500 rounded hover:bg-red-500 hover:text-white transition duration-300">Logout</button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" className="py-2 px-2 font-medium text-gray-500 rounded hover:bg-green-500 hover:text-white transition duration-300">Login</Link>
                      <Link to="/signup" className="py-2 px-2 font-medium text-gray-500 rounded hover:bg-blue-500 hover:text-white transition duration-300">Sign Up</Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </nav>

          <div className="max-w-6xl mx-auto mt-4 sm:mt-8 px-4">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/" element={<PrivateRoute><BloodPressureList /></PrivateRoute>} />
              <Route path="/add" element={<PrivateRoute><BloodPressureForm /></PrivateRoute>} />
              <Route path="/edit/:id" element={<PrivateRoute><BloodPressureForm /></PrivateRoute>} />
              <Route path="/graphs" element={<PrivateRoute><BloodPressureGraphs /></PrivateRoute>} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
