import React, { useState } from 'react'
import style from './gmtos.module.css'
import { useMutation, useQuery } from '@tanstack/react-query';
import { getStudentHaveSemester, getUserById } from '../../../api/api';
import YearPicker from '../../../common/YearPicker';
import MonthYearPicker from '../../../common/MonthYearPicker';
import { toast } from 'react-toastify';

export default function GiveMarksToStudent({ user }) {
    const [subjectPer, setSubjectPer] = useState(null);
    const [selectedSem, setSelectedSem] = useState('');
    const [selectedExamType, setSelectedExamType] = useState('');
    const [monthYear, setMonthYear] = useState(null);
    const [year, setYear] = useState(null);
    const [tableData, setTableData] = useState([]);
    const [selectAll, setSelectAll] = useState(false); // Track select all checkbox state
    const [subjectId, setSubjectId] = useState(null)

    // -------- used for get subject permision and fatching -----
    const { data: subjectData, isLoading, isError } = useQuery({
        queryKey: ["permisionSubject"],
        queryFn: (id) => getUserById(user._id)
    });

    // ------------- Fatch student those have create semester --------
    const { mutate: studentDataMutate } = useMutation({
        mutationFn: getStudentHaveSemester,
        mutationKey: ['student'],
        onSuccess: (data) => {
            toast.success('Successfully get Student');
            setTableData(data)
        },
        onError: (error) => {
            toast.error(error.message);
        },


    })



    function handleOnSelect(e) {
        const value = e.target.value;
        if (value === "1") {
            setSubjectPer(subjectData.semester1Array);
            setSelectedSem(value)
        }
        if (value === "2") {
            setSubjectPer(subjectData.semester2Array);
            setSelectedSem(value)
        }
        if (value === "3") {
            setSubjectPer(subjectData.semester3Array);
            setSelectedSem(value)
        }
        if (value === "4") {
            setSubjectPer(subjectData.semester4Array);
            setSelectedSem(value)
        }
    }

    const handleExamTypeChange = (e) => setSelectedExamType(e.target.value);
    const handleSubjectId = (e) => setSubjectId(e.target.value);

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

    // ----------- Fatching student base details -------
    function handleFatchStudents() {
        if (!selectedSem || !selectedExamType || !monthYear || !year || !subjectId) {
            toast.error("Please select all inputs and selections.");
        } else {
            studentDataMutate({ sem: selectedSem, examType: selectedExamType, date_of_issue: monthYear, admissionDate: year, stream: user?.department, subjectId });
        }
    }


    console.log(selectAll)

    return (
        <div>
            <div className={style.NavContainer}>
                <div className={style.Nav}>
                    <select name="sem" id="sem" onChange={handleOnSelect} defaultValue={""}>
                        <option value="" disabled >Select Sem</option>
                        <option value="1">Semester 1</option>
                        <option value="2">Semester 2</option>
                        <option value="3">Semester 3</option>
                        <option value="4">Semester 4</option>
                    </select>

                    <select name="subjectId" id="subjectId" defaultValue={""} onChange={handleSubjectId}>
                        <option value="" disabled>Select Subject</option>
                        {subjectPer?.length > 0 ? (
                            subjectPer.map((data, i) => (
                                <option value={data._id} key={i}>{data.name}</option>
                            ))
                        ) : (
                            <option disabled>No subjects available</option>
                        )}
                    </select>



                    <select name="examType" id="examType" defaultValue={""} onChange={handleExamTypeChange}>
                        <option value="" disabled>Select Exam Type</option>
                        <option value="regular">Regular</option>
                        <option value="non-regular">Non Regular</option>
                        <option value="atkt">ATKT</option>
                    </select>

                    <div className="">
                        <YearPicker handleYearChange={handleYearChange} />
                    </div>

                    <div className="">
                        <MonthYearPicker handleMonthYearChange={handleMonthYearChange} />
                    </div>

                    <div className="">
                        <button className={style.btnGetstd} onClick={handleFatchStudents}>Get</button>
                    </div>
                </div>
                <div>
                    <button className={style.btn}>Submit</button>
                </div>
            </div>
            {/* ---------- Table for student --------- */}
            <table>
                <thead>
                    <tr>
                        <th style={{ width: "2rem" }}>
                            <input type="checkbox" checked={selectAll} onChange={handleSelectAllChange} style={{
                                // width: "0.5rem", /* Optional for adjusting the clickable area */
                                // height: "1.2rem", /* Optional for adjusting the clickable area */
                                transform: "scale(1.5)", /* Increases the size */
                                cursor: "pointer",

                            }} />
                        </th>
                        <th style={{ width: "8rem" }}>Roll No</th>
                        <th>Name | Father | Surename | Mother</th>
                        <th>Internal</th>
                        <th>External</th>
                        <th>Practical</th>
                    </tr>
                </thead>

                <tbody>
                    {tableData.map((data, i) => (
                        <tr key={i}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={data.selected ?? false}
                                    onChange={() => handleRowCheckboxChange(i)}
                                />
                            </td>
                            <td>{data.rollNo}</td>
                            <td>{data.firstName} {data.fatherName} {data.lastName} {data.motherName}</td>
                            <td>
                                <input
                                    type="number"
                                    placeholder="Internal Mark"
                                    style={{ width: "100%", height: "100%", padding: "0.2rem" }}
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    placeholder="External Mark"
                                    style={{ width: "100%", height: "100%", padding: "0.2rem" }}
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    placeholder="Practical Mark"
                                    style={{ width: "100%", height: "100%", padding: "0.2rem" }}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>

            </table>
        </div>
    )
}
