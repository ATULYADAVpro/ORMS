import React, { useState } from 'react';
import MonthYearPicker from '../../../common/MonthYearPicker';
import style from './generateResult.module.css';
import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { generateResultNow, getCompletedSemesterSubject } from '../../../api/api';
import { useNavigate } from 'react-router-dom';

export default function GenerateResult({ user }) {
    const [selectedSem, setSelectedSem] = useState('');
    const [selectedExamType, setSelectedExamType] = useState('');
    const [monthYear, setMonthYear] = useState(null);
    const handleMonthYearChange = (monthYear) => setMonthYear(monthYear);
    const [tableData, setTableData] = useState(null);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [isAllChecked, setIsAllChecked] = useState(false);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    // Mutation for fetching student data
    const { mutate: studentDataMutate, isLoading } = useMutation({
        mutationFn: getCompletedSemesterSubject,
        mutationKey: ["student"],
        onSuccess: (data) => {
            toast.success("Successfully fetched semester data.");
            setTableData(data);
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    // Mutation for generate result student data
    const { mutate: studentGenerateMutate } = useMutation({
        mutationFn: generateResultNow,
        mutationKey: ["student"],
        onSuccess: (data) => {
            queryClient.invalidateQueries("student")
            toast.dark("Generate Successfully");
            setTimeout(() => {
                navigate(0)
            }, 3000)
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });


    function handleFetchStudents() {
        if (!selectedSem || !selectedExamType || !monthYear || !user.department) {
            toast.error("All fields are required.");
        } else {
            studentDataMutate({
                sem: selectedSem,
                examType: selectedExamType,
                date_of_issue: monthYear,
                stream: user.department,
            });
        }
    }

    function handleCheckboxChange(semesterId) {
        setSelectedUsers(prevSelectedUsers =>
            prevSelectedUsers.includes(semesterId)
                ? prevSelectedUsers.filter(id => id !== semesterId)
                : [...prevSelectedUsers, semesterId]
        );
    }

    function handleSelectAllChange() {
        if (isAllChecked) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(tableData.map(data => data._id));
        }
        setIsAllChecked(!isAllChecked);
    }

    function handleGenerateResult() {
        if (selectedUsers) {
            studentGenerateMutate(selectedUsers)
        } else {
            toast.error("Please selected student!.")
        }
    }

    console.log(selectedUsers)
    return (
        <div>
            <div className={style.NavContainer}>
                <div className={style.Nav}>
                    <select name="sem" id="sem" onChange={(e) => setSelectedSem(e.target.value)} defaultValue="">
                        <option value="" disabled>Select Sem</option>
                        <option value="1">Semester 1</option>
                        <option value="2">Semester 2</option>
                        <option value="3">Semester 3</option>
                        <option value="4">Semester 4</option>
                    </select>
                    <select name="examType" id="examType" defaultValue="" onChange={(e) => setSelectedExamType(e.target.value)}>
                        <option value="" disabled>Select Exam Type</option>
                        <option value="regular">Regular</option>
                        <option value="non-regular">Non Regular</option>
                        <option value="atkt">ATKT</option>
                    </select>
                    <MonthYearPicker handleMonthYearChange={handleMonthYearChange} />
                    <button className={style.btnGetstd} onClick={handleFetchStudents} disabled={isLoading}>
                        {isLoading ? 'Fetching...' : 'Get'}
                    </button>
                </div>
                <button onClick={handleGenerateResult}>Generate</button>
            </div>
            <hr />

            {tableData && (
                <table>
                    <thead>
                        <tr>
                            <th>
                                <input
                                    type="checkbox"
                                    checked={isAllChecked}
                                    onChange={handleSelectAllChange}
                                />
                            </th>
                            <th>RollNo</th>
                            <th>Name</th>
                            <th>Subjects</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map((data, i) => (
                            <tr key={i}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedUsers.includes(data._id)}
                                        onChange={() => handleCheckboxChange(data._id)}
                                    />
                                </td>
                                <td>{data.student.rollNo}</td>
                                <td>{data.student.firstName} {data.student.fatherName} {data.student.lastName}</td>
                                <td>
                                    {data.subjects.map((sub, si) => (
                                        <p key={si} style={{ display: "inline", margin: "5px" }}> {si + 1}. {sub.subjectName}</p>
                                    ))}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
