import React, { useState } from 'react';
import style from './createSem.module.css';
import YearPicker from '../../../common/YearPicker';
import MonthYearPicker from '../../../common/MonthYearPicker';
import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addSemesterinBulk, getStudentForSemester } from '../../../api/api';
import { useNavigate } from 'react-router-dom';

export default function CreateSem({ user }) {
    // State variables for selections
    const [selectedSem, setSelectedSem] = useState('');
    const [selectedExamType, setSelectedExamType] = useState('');
    const [monthYear, setMonthYear] = useState(null);
    const [tableData, setTableData] = useState([]);
    const [selectAll, setSelectAll] = useState(false); // Track select all checkbox state
    const [year, setYear] = useState(null);
    const queryClient = useQueryClient()
    const navigate = useNavigate();

    // --------- Get Student for semester -------
    const { mutate: studentDataMutate } = useMutation({
        mutationFn: getStudentForSemester,
        mutationKey: ["getStudentForSemester"],
        onSuccess: (data) => {
            toast.success('Successfully Fetched Student');
            setTableData(data);
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    // --------- Add Semester in Bulk -------
    const { mutate: addSemesterinBulkMutate } = useMutation({
        mutationFn: addSemesterinBulk,
        mutationKey: ["addSemesterinBulk"],
        onSuccess: (data) => {
            toast.success('Successfully Generated Semester');
            // Refetch student data after successfully adding semester
            queryClient.invalidateQueries(["getStudentForSemester"]);
            setTimeout(() => {
                navigate(0)
            }, 2000)
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });


    // handle Fetch data
    function handleFetchData() {
        if (!selectedSem || !selectedExamType || !monthYear || !year) {
            toast.error("Please select all inputs and selections.");
        } else {
            studentDataMutate({ sem: selectedSem, examType: selectedExamType, date_of_issue: monthYear, admissionDate: year, stream: user?.department });
        }
    }

    // Handle Generate button click
    const handleGenerate = () => {
        const studentArray = tableData.filter(user => user.selected);
        if (!selectedSem || !selectedExamType || !monthYear || !year || !user?.department) {
            toast.error("Please select all inputs and selections.");
        } else {
            addSemesterinBulkMutate({ studentArray, examType: selectedExamType, stream: user?.department, date_of_issue: monthYear, sem: selectedSem })
        }
    };

    // Handle Select changes
    const handleSemChange = (e) => setSelectedSem(e.target.value);
    const handleExamTypeChange = (e) => setSelectedExamType(e.target.value);

    // Handle Year change
    const handleYearChange = (selectedYear) => setYear(selectedYear); // Update year state when selected
    const handleMonthYearChange = (monthYear) => setMonthYear(monthYear);



    // Handle select all checkbox change
    const handleSelectAllChange = (e) => {
        setSelectAll(e.target.checked);
        const updatedData = tableData.map(item => ({ ...item, selected: e.target.checked }));
        setTableData(updatedData);
    };

    // Handle individual row checkbox change
    const handleRowCheckboxChange = (index) => {
        const updatedData = [...tableData];
        updatedData[index].selected = !updatedData[index].selected;
        setTableData(updatedData);
    };

    return (
        <div>
            <div className={style.NavContainer}>
                <div className={style.Nav}>
                    <select name="sem" id="sem" value={selectedSem} onChange={handleSemChange}>
                        <option value="" disabled>Select Sem</option>
                        <option value="1">Semester 1</option>
                        <option value="2">Semester 2</option>
                        <option value="3">Semester 3</option>
                        <option value="4">Semester 4</option>
                        {/* Add more options as needed */}
                    </select>

                    <select name="examType" id="examType" value={selectedExamType} onChange={handleExamTypeChange}>
                        <option value="" disabled>Select Exam Type</option>
                        <option value="regular">Regular</option>
                        <option value="non-regular">Non Regular</option>
                        <option value="atkt">ATKT</option>
                        {/* Add more options as needed */}
                    </select>

                    <div className={style.YearPicker}>
                        <YearPicker handleYearChange={handleYearChange} />
                    </div>

                    <div className={style.MonthYearPicker}>
                        <MonthYearPicker handleMonthYearChange={handleMonthYearChange} />
                    </div>

                    <button className={style.btn} onClick={handleFetchData}>Fetch</button>
                </div>

                <div>
                    <button className={style.btnSubmit} onClick={handleGenerate}>Generate</button>
                </div>
            </div>

            <div className={style.mainData}>
                <table>
                    <thead>
                        <tr>
                            <th style={{ width: "2rem" }}>
                                <div className="" style={{ width: "100%", textAlign:"center", }}>
                                    <input
                                        type="checkbox"
                                        checked={selectAll}
                                        onChange={handleSelectAllChange}
                                        style={{
                                            // width: "0.5rem", /* Optional for adjusting the clickable area */
                                            // height: "1.2rem", /* Optional for adjusting the clickable area */
                                            transform: "scale(1.5)", /* Increases the size */
                                            cursor: "pointer",
                                        }}
                                    />
                                </div>
                            </th>
                            <th style={{ width: "11rem" }}>Admission Date</th>
                            <th style={{ width: "8rem" }}>Roll No</th>
                            <th>Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map((data, index) => (
                            <tr key={index}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={data.selected || false}
                                        onChange={() => handleRowCheckboxChange(index)}
                                    />
                                </td>
                                <td>{data.admissionDate}</td>
                                <td>{data.rollNo}</td>
                                <td>{data.name}</td>
                            </tr>
                        ))}

                    </tbody>
                </table>
            </div>
        </div>
    );
}
