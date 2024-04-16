import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Draws from './Draws';

function App() {
  return (
    <Router>
      <Routes>  // Use 'Routes' instead of 'Switch'
        <Route path="/" element={<Home />} />  // Update syntax for defining routes
        <Route path="/draws" element={<Draws />} />
      </Routes>
    </Router>
  );
}

export default App;
