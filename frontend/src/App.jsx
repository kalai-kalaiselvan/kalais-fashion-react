import React from 'react';

import { Routes, Route } from 'react-router-dom';

import Home from './Home';

import Login from './page/Login';

import Register from './page/Register';

import UserDashboard from './page/UserDashboard';

import AdminDashboard from './page/AdminDashboard';

import ProtectedRoute from './components/protectedRoute';
import CartPage from './page/CartPage';

function App() {

    return (

        <Routes>

            <Route path="/" element={<Home />} />

            <Route path="/Login" element={<Login />} />

            <Route path="/register" element={<Register />} />
            <Route path="/cart" element={<CartPage />} />
            <Route
                path="/user-dashboard"
                element={
                    <ProtectedRoute role="user">
                        <UserDashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin-dashboard"
                element={
                    <ProtectedRoute role="admin">
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />

        </Routes>

    );

}

export default App;