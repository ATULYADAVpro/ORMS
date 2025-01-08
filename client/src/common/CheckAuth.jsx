import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export default function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect unauthenticated users to /login if they're not already there or at /
    if (location.pathname !== '/login' && location.pathname !== '/') {
      return <Navigate to="/login" replace />;
    }
  } else {
    const { role } = user;

    // Redirect authenticated users from /login or / to their role-specific home page
    if (location.pathname === '/login' || location.pathname === '/') {
      return <Navigate to={`/${role}/home`} replace />;
    }

    // Restrict access to admin routes
    if (role === 'admin') {
      if (location.pathname === '/admin') {
        return <Navigate to="/admin/home" replace />;
      }
      if (location.pathname.startsWith('/admin')) {
        return children;
      }
    }

    // Allow teacher role to access hod routes
    if (role === 'hod' && location.pathname.startsWith('/hod')) {
      return children;
    }
    
    // Allow teacher role to access teacher routes
    if (role === 'teachar' && location.pathname.startsWith('/teachar')) {
      return children;
    }
    // Restrict unauthorized access
    return <Navigate to="/unauth-page" replace />;
  }

  // Render children if no redirect conditions are met
  return <>{children}</>;
}
