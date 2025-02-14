import React, { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, admin }) => {
  const user = localStorage.getItem("user")

  // If user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, check if user is admin or not
  const { role } = JSON.parse(user);
  if (admin && role !== 'admin') {
    alert('You are not authorized to access this page.');
    return <Navigate to="/" replace />;
  }

  // If authenticated and user is admin, render the provided component
  return element;
};

export default ProtectedRoute;
