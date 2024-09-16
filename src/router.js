import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AuthHandler from './components/AuthHandler';
import Login from './pages/Login';
import AddProduct from './pages/AddProduct';
import UpdateProduct from './pages/UpdateProduct';
import HistoryPurchase from './pages/HistoryPurchase';
import ListProduct from './pages/ListProduct';

const AppRouter = () => {
  return (
    <Router>
      <AuthHandler />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/AddProduct" element={<AddProduct />} />
        <Route path="/UpdateProduct" element={<UpdateProduct />} />
        <Route path="/HistoryPurchase" element={<HistoryPurchase />} />
        <Route path="/ListProduct" element={<ListProduct />} />
   

        
      </Routes>
    </Router>
  );
};

export default AppRouter;
