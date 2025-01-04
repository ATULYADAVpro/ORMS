import React, { useState } from 'react';
import style from './listStudent.module.css';
import { useQuery } from '@tanstack/react-query';
import { getDepartment, getStudent } from '../../../api/api';
import StudentDetails from './common/StudentDetails';

export default function ListStudent() {
  const [search, setSearch] = useState('');
  const [selectedStream, setSelectedStream] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);

  // -------------- Get Student Query -----------
  const { data: studentData, isLoading: studentLoading, isError: studentError } = useQuery({
    queryKey: ['students'],
    queryFn: getStudent
  });

  // -------------- Get Department Query -----------
  const { data: departmentData, isLoading: departmentLoading, isError: departmentError } = useQuery({
    queryKey: ['department'],
    queryFn: getDepartment
  });

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleStreamChange = (e) => {
    setSelectedStream(e.target.value);
  };

  const handleMoreClick = (student) => {
    setSelectedStudent(student);
  };

  const handleBackClick = () => {
    setSelectedStudent(null);
  };

  const filteredStudents = studentData?.getStudent?.filter((student) => {
    return (
      (student.firstName.toLowerCase().includes(search.toLowerCase()) ||
        student.rollNo.toString().includes(search)) &&
      (selectedStream ? student.stream._id === selectedStream : true)
    );
  });

  return (
    <>
      {selectedStudent ? (
        <StudentDetails selectedStudent={selectedStudent} onBack={handleBackClick} />
      ) : (
        <div className={style.container}>
          <div className={style.controls}>
            <input
              type="search"
              placeholder="Search by name or roll number"
              value={search}
              onChange={handleSearchChange}
              className={style.searchInput}
            />
          </div>
          <div className={style.table_container}>
            <table>
              <thead>
                <tr>
                  <th>Profile</th>
                  <th>Roll No</th>
                  <th>Name</th>
                  <th>
                    <select
                      className={style.stream}
                      name="stream"
                      id="stream"
                      value={selectedStream}
                      onChange={handleStreamChange}
                    >
                      <option value="">Stream</option>
                      {departmentData?.department.map((data, i) => (
                        <option key={i} value={data._id}>{data.stream}</option>
                      ))}
                    </select>
                  </th>
                  <th>Admission Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents?.length > 0 ? (
                  filteredStudents.map((data) => (
                    <tr key={data._id}>
                      <td className={style.profile}>
                        <img src={data.profileUrl} alt="profile" />
                      </td>
                      <td>{data.rollNo}</td>
                      <td>{data.firstName} {data.fatherName} {data.lastName} {data.motherName}</td>
                      <td>{data.stream?.stream}</td>
                      <td>{data.admissionDate}</td>
                      <td><button onClick={() => handleMoreClick(data)} className={style.btn}>More</button></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className={style.noData}>Data are not available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
