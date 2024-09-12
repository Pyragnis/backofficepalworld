import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AuthHandler from './components/AuthHandler';
import Login from './pages/Login';

const AppRouter = () => {
  return (
    <Router>
      <AuthHandler />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
   

        
      </Routes>
    </Router>
  );
};

export default AppRouter;
