import React, { useState } from 'react';
import MonthYearPicker from '../../../common/MonthYearPicker';
import style from './generateResult.module.css';
import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';
import { getInCompletedSemesterSubject } from '../../../api/api';

export default function IncompleteSem({ user }) {
    const [selectedSem, setSelectedSem] = useState('');
    const [selectedExamType, setSelectedExamType] = useState('');
    const [monthYear, setMonthYear] = useState(null);
    const handleMonthYearChange = (monthYear) => setMonthYear(monthYear);
    const [tableData, setTableData] = useState(null);

    // Mutation for fetching student data
    const { mutate: studentDataMutate, isLoading } = useMutation({
        mutationFn: getInCompletedSemesterSubject,
        mutationKey: ["student"],
        onSuccess: (data) => {
            toast.success("Successfully fetched semester data.");
            setTableData(data);
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

    console.log(tableData)

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
                {/* <button onClick={handleGenerateResult}>Generate</button> */}
            </div>
            <hr />

            {tableData && (
                <table>
                    <thead>
                        <tr>
                            <th>RollNo</th>
                            <th>Name</th>
                            <th>In Subjects</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map((data, i) => {

                            return (
                                <tr key={i}>
                                    <td>{data.semester.student.rollNo}</td>
                                    <td>{data.semester.student.firstName} {data.semester.student.fatherName} {data.semester.student.lastName}</td>
                                    <td>
                                        {
                                            data.leftSubjects.map((left, fi) => {
                                                return (
                                                    <p key={fi} style={{ display: "inline", margin: "5px" }}> {fi +1} {left.name}</p>
                                                )
                                            })
                                        }
                                    </td>
                                </tr>
                            )

                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
}
