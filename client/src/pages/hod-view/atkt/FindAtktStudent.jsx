import React, { useState } from 'react'
import YearPicker from '../../../common/YearPicker'
import MonthYearPicker from '../../../common/MonthYearPicker'
import style from './createSem.module.css';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { findAtktSemesters, subjectDeleteInAtkt } from '../../../api/api';

export default function FindAtktStudent({ user }) {

    const [selectedSem, setSelectedSem] = useState('');
    const [selectedExamType, setSelectedExamType] = useState('');
    const [monthYear, setMonthYear] = useState(null);
    const [monthYearAtkt, setMonthYearAtkt] = useState(null);
    const [tableData, setTableData] = useState([]);
    const [selectAll, setSelectAll] = useState(false); // Track select all checkbox state
    const queryClient = useQueryClient()
    const navigate = useNavigate();

    // --------- Get Student for semester -------
    const { mutate: studentDataMutate } = useMutation({
        mutationFn: findAtktSemesters,
        mutationKey: ["findAtktSemester"],
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
        mutationFn: subjectDeleteInAtkt,
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
        if (!selectedSem || !selectedExamType || !monthYear) {
            toast.error("Please select all inputs and selections.");
        } else {
            studentDataMutate({ sem: selectedSem, examType: selectedExamType, date_of_issue: monthYear, stream: user?.department });
        }
    }

    // Handle Generate button click
    // Handle Generate button click
    const handleGenerate = () => {
        const semesterArray = tableData
            .filter((data) => data.selected)
            .map((data) => (data.semester._id));

        // Uncomment this section if you are using it for some purpose
        // if (!selectedSem || !selectedExamType || !monthYear || !year || !user?.department) {
        //     toast.error("Please select all inputs and selections.");
        // } else {
        addSemesterinBulkMutate({ semesterArray, date_of_issue: monthYearAtkt })
        // }

        console.log(semesterArray);
    };


    // Handle Select changes
    const handleSemChange = (e) => setSelectedSem(e.target.value);
    const handleExamTypeChange = (e) => setSelectedExamType(e.target.value);

    // Handle Year change
    const handleMonthYearChange = (monthYear) => setMonthYear(monthYear);
    const handleMonthYearChangeAtkt = (monthYearAtkt) => setMonthYearAtkt(monthYearAtkt);



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

    // console.log(tableData)

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
                        {/* <option value="atkt">ATKT</option> */}
                        {/* Add more options as needed */}
                    </select>



                    <div className={style.MonthYearPicker}>
                        <MonthYearPicker handleMonthYearChange={handleMonthYearChange} />
                    </div>

                    <button className={style.btn} onClick={handleFetchData}>Get</button>
                </div>

                <div>
                    <button className={style.btnSubmit} onClick={handleGenerate}>Generate</button>
                </div>
            </div>

            <div >
                {/* <br /> */}
                <p>Select Atkt Date</p>
                <MonthYearPicker handleMonthYearChange={handleMonthYearChangeAtkt} />
                {/* <br /> */}
            </div>

            <div className={style.mainData}>
                <table>
                    <thead>
                        <tr>
                            <th style={{ width: "2rem" }}>
                                <div className="" style={{ width: "100%", textAlign: "center", }}>
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
                            <th>Fail Subject</th>
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
                                <td>{data?.semester?.student?.admissionDate}</td>
                                <td>{data?.semester?.student?.rollNo}</td>
                                <td>{data?.semester?.student?.firstName} {data?.semester?.student?.fatherName} {data?.semester?.student?.lastName} {data?.semester?.student?.motherName}</td>
                                <td>
                                    {data?.failSubjects.map((sub, i) => (
                                        <p key={i}>{i + 1}. {sub.subjectName} </p>
                                    ))

                                    }
                                </td>
                            </tr>
                        ))}

                    </tbody>
                </table>
            </div>

        </div>
    )
}
