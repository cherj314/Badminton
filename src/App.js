import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home'; // Adjust the path according to your project structure
import logo from './logo.svg';
import './App.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                {/* Define other routes here, using the `element` prop */}
            </Routes>
        </Router>
    );
}

export default App;
