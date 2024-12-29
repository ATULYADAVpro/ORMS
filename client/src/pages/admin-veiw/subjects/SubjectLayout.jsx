import React from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

export default function SubjectLayout() {
    const navigate = useNavigate();
    const location = useLocation();

    function handleFacultyPath(e) {
        const path = e.target.value;
        // console.log(path);
        navigate(path);
    }
    return (
        <div>
            <div>
                <select
                    name="facultyPath"
                    id="facultyPath"
                    onChange={handleFacultyPath}
                    value={location.pathname} // Set the default value based on current path
                    style={{ border: 'none', outline: 'none', margin: '0.3rem' }}
                >
                    <option value="/admin/subject">Subjects</option>
                    <option value="/admin/subject/add">Add</option>
                </select>
            </div>
            <Outlet />
        </div>
    )
}
