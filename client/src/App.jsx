import React, { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query'; // Importing React Query hooks
import AuthLayout from './pages/auth/AuthLayout';
import Login from './pages/auth/Login';
import CheckAuth from './common/CheckAuth';
import AdminLayout from './pages/admin-veiw/dashboard/Layout';
import Home from './pages/admin-veiw/Home';
import Student from './pages/admin-veiw/Student';
import NotFound from './common/NotFound';
import UnAuth from './common/UnAuth';
import Faculty from './pages/admin-veiw/faculty/Faculty';


// Custom hook to fetch auth data
const useAuth = () => {
  return useQuery({
    queryKey: ['auth'],  // Correct query key format
    queryFn: () => {
      // Fetch from localStorage or use initial values
      const authData = JSON.parse(localStorage.getItem('auth')) || { isAuthenticated: false, user: null };
      return authData;
    },
  });
};

export default function App() {
  const navigate = useNavigate();
  const { data: authData, isLoading, isError } = useAuth();  // Retrieve auth data

  useEffect(() => {
    if (!isLoading && authData) {
      const { isAuthenticated, user } = authData;

      // Only redirect from root or login pages
      if (isAuthenticated && (window.location.pathname === '/' || window.location.pathname === '/login')) {
        if (user?.role === 'admin') {
          navigate('/admin/home');
        } else if (user?.role === 'teacher') {
          navigate('/teacher/home');
        }
      }
    }
  }, [authData, isLoading, navigate]);


  // If loading or error, show loading spinner or handle the error gracefully
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching authentication data. Please try again later.</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<CheckAuth isAuthenticated={authData?.isAuthenticated} user={authData?.user}><AuthLayout /></CheckAuth>} >
        <Route path="login" element={<Login />} />
      </Route>

      <Route path="/admin" element={<CheckAuth isAuthenticated={authData?.isAuthenticated} user={authData?.user}><AdminLayout /></CheckAuth>} >
        <Route index element={<Home />} />
        <Route path="home" element={<Home />} />
        <Route path="faculty" element={<Faculty />} />
        <Route path="student" element={<Student />} />
      </Route>

      <Route path="*" element={<NotFound />} />
      <Route path="/unauth-page" element={<UnAuth />} />
    </Routes>

  );
}
