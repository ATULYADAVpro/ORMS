import React from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

export default function StudentLayout() {
  const navigate = useNavigate();
  const location = useLocation();


  function handleFacultyPath(e) {
    const path = e.target.value;
    // console.log(path);
    navigate(path);
  }

  return (
    <>
      <select
        name="department"
        id="department"
        onChange={handleFacultyPath}
        value={location.pathname} // Set the default value based on current path
        style={{ border: 'none', outline: 'none', margin: '0.3rem' }}
      >
        <option value="/admin/student">Student Lists</option>
        <option value="/admin/student/add">Add Student</option>
        <option value="/admin/student/exportResult">Export Result</option>
      </select>
      <Outlet />

    </>
  )
}
