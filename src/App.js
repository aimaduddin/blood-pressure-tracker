import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import BloodPressureList from './components/BloodPressureList';
import BloodPressureForm from './components/BloodPressureForm';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/add">Add Reading</Link></li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<BloodPressureList />} />
          <Route path="/add" element={<BloodPressureForm />} />
          <Route path="/edit/:id" element={<BloodPressureForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
