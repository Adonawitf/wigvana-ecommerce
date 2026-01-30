import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const ProtectedAdminRoute = ({ children }) => {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        toast.error('Please log in to access this page');
        return <Navigate to="/login" replace />;
    }

    if (!user?.roles?.includes('admin')) {
        toast.error('This page is only accessible to administrators');
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedAdminRoute;
