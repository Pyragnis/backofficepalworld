import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AuthHandler from './components/AuthHandler';
import Login from './pages/Login';
import AddProduct from './pages/Products/AddProduct.js';
import UpdateProduct from './pages/Products/UpdateProduct.js';
import PurchaseHistory from './pages/PurchaseHistory';
import ProductList from './pages/Products/Products.js';
import Categories from './pages/Categories/Categories.js';
import Users from './pages/Users/Users.js';
import UserOrders from './pages/Users/UserOrders.js';

const AppRouter = () => {
  return (
    <Router>
      <AuthHandler />
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/products-list" element={<ProductList />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/update-product/:id" element={<UpdateProduct />} />

        <Route path="/categories" element={<Categories />} />

        <Route path="/purchase-history" element={<PurchaseHistory />} />

        <Route path="/users" element={<Users />} />
        <Route path="/user-orders/:userId" element={<UserOrders />} />

   
      </Routes>
    </Router>
  );
};

export default AppRouter;
