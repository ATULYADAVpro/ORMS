import React, { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query'; // Importing React Query hooks
import AuthLayout from './pages/auth/AuthLayout';
import Login from './pages/auth/Login';
import CheckAuth from './common/CheckAuth';
import AdminLayout from './pages/admin-veiw/dashboard/Layout';
import Home from './pages/admin-veiw/home/Home';
import StudentLayout from './pages/admin-veiw/student/StudentLayout';
import NotFound from './common/NotFound';
import UnAuth from './common/UnAuth';
import Faculty from './pages/admin-veiw/faculty/Faculty';
import FacultyLayout from './pages/admin-veiw/faculty/FacultyLayout';
import ViewFaculty from './pages/admin-veiw/faculty/ViewFaculty';
import SubjectLayout from './pages/admin-veiw/subjects/SubjectLayout';
import SubjectsList from './pages/admin-veiw/subjects/SubjectsList';
import SubjectAdd from './pages/admin-veiw/subjects/SubjectAdd';
import DepartmentLayout from './pages/admin-veiw/department/DepartmentLayout';
import DepartmentList from './pages/admin-veiw/department/DepartmentList';
import DepartmentAdd from './pages/admin-veiw/department/DepartmentAdd';
import ListStudent from './pages/admin-veiw/student/ListStudent';
import AddStudent from './pages/admin-veiw/student/AddStudent';
import HodLayout from './pages/hod-view/dashboard/HodLayout';
import FacultyLayoutDashboard from './pages/faculty-view/dashboard/FacultyLayoutDashboard';
import HodHome from './pages/hod-view/home/HodHome';
import TeacharHome from './pages/faculty-view/home/TeacharHome';
import CreateSem from './pages/hod-view/generate sem/CreateSem';
import GiveMarksToStudent from './pages/hod-view/givemarks/GiveMarksToStudent';
import GiveMarksToStudentInTeachar from './pages/faculty-view/givemarks/GiveMarksToStudentInTeachar';
import StudentSheets from './pages/faculty-view/studentSheets/StudentSheets';
import StudentSheetsHod from './pages/hod-view/studentSheets/StudentSheetsInHod';
import GenerateResult from './pages/hod-view/generateResult/GenerateResult';
import IncompleteSem from './pages/hod-view/inCompleteSem/IncompleteSem';
import ExportsResult from './pages/admin-veiw/student/export result/ExportsResult';


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

  // console.log(authData)
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
      {/* Authentication Routes Here  */}
      <Route path="/" element={<CheckAuth isAuthenticated={authData?.isAuthenticated} user={authData?.user}><AuthLayout /></CheckAuth>} >
        <Route path="login" element={<Login />} />
      </Route>
      {/* Admin Routes Here  */}
      <Route path="/admin" element={<CheckAuth isAuthenticated={authData?.isAuthenticated} user={authData?.user}><AdminLayout /></CheckAuth>} >
        {/* admin Home routes  */}
        <Route index element={<Home />} />
        <Route path="home" element={<Home />} />
        {/* admin faculty routes  */}
        <Route path="faculty" element={<FacultyLayout />} >
          <Route index element={<Faculty />} />
          <Route path="list" element={<ViewFaculty />} />
        </Route>
        {/* admin subject routes  */}
        <Route path='subject' element={<SubjectLayout />} >
          <Route index element={<SubjectsList />} />
          <Route path="add" element={<SubjectAdd />} />
        </Route>
        {/* admin department routes  */}
        <Route path='department' element={<DepartmentLayout />}>
          <Route index element={<DepartmentList />} />
          <Route path='add' element={<DepartmentAdd />} />
        </Route>

        {/* admin student routes  */}
        <Route path='student' element={<StudentLayout />}>
          <Route index element={<ListStudent />} />
          <Route path='add' element={<AddStudent />} />
          <Route path='exportResult' element={<ExportsResult />} />
        </Route>
      </Route>

      {/* Hod Routes Here  */}
      <Route path='/hod' element={<CheckAuth isAuthenticated={authData?.isAuthenticated} user={authData?.user}> <HodLayout /> </CheckAuth>}>
        <Route index  element={<HodHome />} />
        <Route path='home'  element={<HodHome />} />
        <Route path='createSem'  element={<CreateSem user={authData?.user} />} />
        <Route path='giveMark'  element={<GiveMarksToStudent user={authData?.user} />} />
        <Route path='listStudentMark'  element={<StudentSheetsHod user={authData?.user} />} />
        <Route path='generateResult'  element={<GenerateResult user={authData?.user} />} />
        <Route path='inCompleteSem'  element={<IncompleteSem user={authData?.user} />} />
      </Route>

      {/* Teachar Routes Here  */}
      <Route path='/teacher' element={<CheckAuth isAuthenticated={authData?.isAuthenticated} user={authData?.user}> <FacultyLayoutDashboard /> </CheckAuth>}>
        <Route index  element={<TeacharHome />} />
        <Route path='home'  element={<TeacharHome />} />
        <Route path='giveMark'  element={<GiveMarksToStudentInTeachar user={authData?.user} />} />
        <Route path='listStudentMark'  element={<StudentSheets user={authData?.user} />} />
      </Route>

      <Route path="*" element={<NotFound />} />
      <Route path="/unauth-page" element={<UnAuth />} />
    </Routes>

  );
}
