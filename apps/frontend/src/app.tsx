import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './signup';
import Login from './login';
import Home from './home'

import './app.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
