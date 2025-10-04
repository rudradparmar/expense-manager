import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardRedirect = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Redirect to appropriate dashboard based on user role
  switch (user.role) {
    case 'Admin':
      return <Navigate to="/admin/dashboard" replace />;
    case 'Manager':
      return <Navigate to="/manager/dashboard" replace />;
    case 'Employee':
      return <Navigate to="/employee/dashboard" replace />;
    default:
      return <Navigate to="/employee/dashboard" replace />;
  }
};

export default DashboardRedirect;
