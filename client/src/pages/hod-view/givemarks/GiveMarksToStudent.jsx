import React, { useState, useEffect } from 'react';
import style from './gmtos.module.css';
import { useMutation, useQuery } from '@tanstack/react-query';
import { addSubjectsInSemesterBulk, getDepartmentById, getStudentHaveSemester, getUserById } from '../../../api/api';
import YearPicker from '../../../common/YearPicker';
import MonthYearPicker from '../../../common/MonthYearPicker';
import { toast } from 'react-toastify';
import ExcelReader from '../../../common/ExcelDataGet';
import { useNavigate } from 'react-router-dom'

export default function GiveMarksToStudent({ user }) {
    const [subjectPer, setSubjectPer] = useState(null);
    const [selectedSem, setSelectedSem] = useState('');
    const [selectedExamType, setSelectedExamType] = useState('');
    const [monthYear, setMonthYear] = useState(null);
    const [year, setYear] = useState(null);
    const [tableData, setTableData] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [subjectId, setSubjectId] = useState(null);
    const [getExcelData, setExcelDatatoStd] = useState(null); // Holds Excel data
    const [markValidtaion, setmarlValidation] = useState(null);
    const navigate = useNavigate();


    const { data: subjectData, isLoading, isError } = useQuery({
        queryKey: ["permisionSubject"],
        queryFn: (id) => getUserById(user._id),
    });

    const { data: departmentData } = useQuery({
        queryKey: ["department"],
        queryFn: (id) => getDepartmentById(user.department),
    });


    const { mutate: studentDataMutate } = useMutation({
        mutationFn: getStudentHaveSemester,
        mutationKey: ['student'],
        onSuccess: (data) => {
            if (data.length > 0) {
                toast.success('Successfully fetched students.');
                setTableData(data);
            }

            if (data.length === 0) {
                toast.info('No semester or Already add subject');

            }
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });


    const { mutate: addSubjectsInSemesterBulkMutate } = useMutation({
        mutationFn: addSubjectsInSemesterBulk,
        mutationKey: ['student'],
        onSuccess: (data) => {
            toast.success('Successfully subject add students.');
            setTimeout(() => {
                navigate(0)
            }, 3000)

        },
        onError: (error) => {
            toast.error(error.message);
        },
    });






    function handleOnSelect(e) {
        const value = e.target.value;
        if (value === "1") setSubjectPer(subjectData.semester1Array);
        if (value === "2") setSubjectPer(subjectData.semester2Array);
        if (value === "3") setSubjectPer(subjectData.semester3Array);
        if (value === "4") setSubjectPer(subjectData.semester4Array);
        setSelectedSem(value);
    }

    const handleYearChange = (selectedYear) => setYear(selectedYear);
    const handleMonthYearChange = (monthYear) => setMonthYear(monthYear);

    const handleSelectAllChange = (e) => {
        const updatedData = tableData.map((item) => {
            if (
                !item.internal ||
                !item.external ||
                !item.practicalMark
            ) {
                toast.error("Please fill all input fields for all rows before selecting all.");
                return { ...item, selected: false };
            }
            return { ...item, selected: e.target.checked };
        });
        setSelectAll(e.target.checked);
        setTableData(updatedData);
    };

    const handleRowCheckboxChange = (index) => {
        const updatedData = [...tableData];
        const row = updatedData[index];

        if (!row.internal || !row.external || !row.practicalMark) {
            toast.error("Please fill all input fields for this row before selecting the checkbox.");
            return;
        }

        row.selected = !row.selected;
        setTableData(updatedData);
    };

    const handleInputChange = (index, field, value) => {
        const updatedData = [...tableData];
        updatedData[index][field] = value;
        setTableData(updatedData);
    };

    function handleFatchStudents() {
        if (!selectedSem || !selectedExamType || !monthYear || !year || !subjectId) {
            toast.error("Please select all inputs and selections.");
        } else {
            studentDataMutate({
                sem: selectedSem,
                examType: selectedExamType,
                date_of_issue: monthYear,
                admissionDate: year,
                stream: user?.department,
                subjectId,
            });
        }
    }



    useEffect(() => {
        if (getExcelData && tableData) {
            // Loop through the tableData and update the input fields if there's a match in getExcelData
            if (!tableData) {
                toast.error("Get Student")
            } else {
                const updatedTableData = tableData.map((data) => {
                    // Find the matching entry in getExcelData based on rollNo
                    const matchingExcelData = getExcelData.find(excelData => excelData[0] === data.rollNo);

                    if (matchingExcelData) {
                        // If match is found, update internal and external marks

                        const updatedData = {
                            ...data,
                            internal: matchingExcelData[2], // internal from Excel
                            external: matchingExcelData[3], // external from Excel
                        };

                        // Only add practicalMark if it's required
                        if (departmentData?.department?.practical) {
                            updatedData.practicalMark = matchingExcelData[4] || "";
                        }

                        return updatedData;
                    }

                    // If no match is found, return the original data with internal and external as empty
                    return {
                        ...data,
                        internal: "",
                        external: "",
                        practicalMark: departmentData?.department?.practical ? "" : undefined, // Do not include practicalMark if not required
                    };
                });

                // Update tableData with the modified data
                setTableData(updatedTableData);
            }
        }

    }, [getExcelData]);


    useEffect(() => {
        if (subjectPer && subjectId) {
            const subjectDetail = subjectPer.find(subpre => subpre._id === subjectId);
            if (subjectDetail) {
                setmarlValidation(subjectDetail); // Assuming this expects an object
            } else {
                setmarlValidation(null); // Handle case where no subject matches
            }
        }
    }, [subjectPer, subjectId]);



    function handleSubmitData() {
        const selectedStudentData = tableData.filter(student => student.selected)
        let studentsData = [];
        if (subjectId && markValidtaion) {
            for (const element of selectedStudentData) {

                const semesterDetails = {
                    sem: selectedSem,
                    date_of_issue: monthYear,
                    student: element._id,
                    stream: user.department
                };

                const markDetails = {
                    subjectId: subjectId,
                    subjectName: markValidtaion.name,
                    subjectCode: markValidtaion.code,
                    internal: element.internal,
                    external: element.external,
                    internalMax: element.internalMax,
                    externalMax: element.externalMax,
                    internalMin: element.internalMin,
                    externalMin: element.externalMin,
                    totalMax: markValidtaion.totalMax,
                    totalMin: markValidtaion.totalMin,
                    credit: markValidtaion.credit,
                }
                if (departmentData?.department?.practical) {
                    markDetails.practicalName = markValidtaion.practicalName,
                        markDetails.practicalMax = markValidtaion.practicalMax,
                        markDetails.practicalMin = markValidtaion.practicalMin,
                        markDetails.practicalCode = markValidtaion.practicalCode,
                        markDetails.practicalCredit = markValidtaion.practicalCredit,
                        markDetails.practicalMark = element.practicalMark || "";
                }

                const finalData = { semesterDetails, markDetails };
                studentsData.push(finalData)

            }
        }


        if (studentsData) {
            const payload = {
                studentsData
            }
            addSubjectsInSemesterBulkMutate(payload)
            console.log(payload)
        }

    }


    return (
        <div>
            <div className={style.NavContainer}>
                <div className={style.Nav}>
                    <select name="sem" id="sem" onChange={handleOnSelect} defaultValue={""}>
                        <option value="" disabled>Select Sem</option>
                        <option value="1">Semester 1</option>
                        <option value="2">Semester 2</option>
                        <option value="3">Semester 3</option>
                        <option value="4">Semester 4</option>
                    </select>

                    <select name="subjectId" id="subjectId" defaultValue={""} onChange={(e) => setSubjectId(e.target.value)}>
                        <option value="" disabled>Select Subject</option>
                        {subjectPer?.length > 0
                            ? subjectPer.map((data, i) => (
                                <option value={data._id} key={i}>
                                    {data.name}
                                </option>
                            ))
                            : <option disabled>No subjects available</option>}
                    </select>

                    <select name="examType" id="examType" defaultValue={""} onChange={(e) => setSelectedExamType(e.target.value)}>
                        <option value="" disabled>Select Exam Type</option>
                        <option value="regular">Regular</option>
                        <option value="non-regular">Non Regular</option>
                        <option value="atkt">ATKT</option>
                    </select>

                    <YearPicker handleYearChange={handleYearChange} />
                    <MonthYearPicker handleMonthYearChange={handleMonthYearChange} />
                    <button className={style.btnGetstd} onClick={handleFatchStudents}>Get</button>
                </div>
                <button onClick={handleSubmitData}>Submit</button>

            </div>

            <div style={{ margin: "0.4rem" }}>
                <ExcelReader setExcelDatatoStd={setExcelDatatoStd} />
            </div>

            <table>
                <thead>
                    <tr>
                        <th>
                            <input
                                type="checkbox"
                                checked={selectAll}
                                onChange={handleSelectAllChange}
                                style={{ transform: "scale(1.5)", cursor: "pointer" }}
                            />
                        </th>
                        <th>Roll No</th>
                        <th>Name</th>
                        <th>Internal</th>
                        <th>External</th>
                        {
                            departmentData?.department?.practical === true && <th>Practical</th>
                        }

                    </tr>
                </thead>
                <tbody>

                    {
                        tableData && tableData.length > 0 ? (
                            tableData.map((data, i) => (
                                <tr key={i}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={data.selected || false}
                                            onChange={() => handleRowCheckboxChange(i)}
                                        />
                                    </td>
                                    <td>{data.rollNo}</td>
                                    <td>{data.firstName} {data.fatherName} {data.lastName} {data.motherName}</td>
                                    <td>
                                        <input
                                            type="number"
                                            placeholder="Internal Mark"
                                            value={data.internal || ""}
                                            max={markValidtaion.internalMax || ""}
                                            // min={markValidtaion.internalMin || ""}
                                            onChange={(e) => handleInputChange(i, "internal", e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            placeholder="External Mark"
                                            value={data.external || ""}
                                            max={markValidtaion.externalMax || ""}
                                            // min={markValidtaion.externalMin || ""}
                                            onChange={(e) => handleInputChange(i, "external", e.target.value)}
                                        />
                                    </td>
                                    {
                                        departmentData?.department?.practical === true &&
                                        <td>
                                            <input
                                                type="number"
                                                placeholder="Practical Mark"
                                                value={data.practicalMark || ""}
                                                max={markValidtaion.practicalMax || ""}
                                                // min={markValidtaion.practicalMin || ""}
                                                onChange={(e) => handleInputChange(i, "practicalMark", e.target.value)}
                                            />
                                        </td>
                                    }

                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={"6"}>No data Available</td>
                            </tr>
                        )
                    }
                </tbody>
            </table>


        </div>
    );
}
