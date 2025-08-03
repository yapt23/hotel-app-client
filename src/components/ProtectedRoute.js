// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');

    if (!token) {
        // Jika tidak ada token, arahkan ke halaman login
        return <Navigate to="/login" />;
    }

    // Jika ada token, tampilkan halaman yang dilindungi
    return children;
};

export default ProtectedRoute;