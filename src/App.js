import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import BloodPressureList from './components/BloodPressureList';
import BloodPressureForm from './components/BloodPressureForm';
import './App.css';

function App() {
  return (
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
              <div className="hidden md:flex items-center space-x-3">
                <Link to="/" className="py-2 px-2 font-medium text-gray-500 rounded hover:bg-green-500 hover:text-white transition duration-300">Home</Link>
                <Link to="/add" className="py-2 px-2 font-medium text-white bg-green-500 rounded hover:bg-green-400 transition duration-300">Add Reading</Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-6xl mx-auto mt-8 px-4">
          <Routes>
            <Route path="/" element={<BloodPressureList />} />
            <Route path="/add" element={<BloodPressureForm />} />
            <Route path="/edit/:id" element={<BloodPressureForm />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
