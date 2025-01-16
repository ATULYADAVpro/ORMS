import React, { useState } from 'react';
import MonthYearPicker from '../../../../common/MonthYearPicker';
import style from './style.module.css';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getActiveSemesterForExportResult, getDepartment } from '../../../../api/api';
import { toast } from 'react-toastify';
import PrintFace from './PrintFace';

export default function ExportsResult() {
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [allChecked, setAllChecked] = useState(false);
    const [monthYear, setMonthYear] = useState(null);
    const [tableData, setTableData] = useState(null);
    const [stream, setStream] = useState(null);
    const [sem, setSem] = useState(null);
    const [examType, setExamType] = useState(null);
    const [back, setBack] = useState(false);

    // ------------- React Query handle -----------
    const { data: departmentData } = useQuery({
        queryKey: ["department"],
        queryFn: getDepartment,
    });

    const { mutate: getActiveSemesterForExportResultMutate } = useMutation({
        mutationFn: getActiveSemesterForExportResult,
        onSuccess: (data) => {
            toast.success('Successful');
            setTableData(data);
            // queryClient.invalidateQueries(['students']);
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    function handleFetch() {
        if (!monthYear || !examType || !sem || !stream) {
            toast.error("All fields are required.");
        } else {
            getActiveSemesterForExportResultMutate({ sem, examType, stream, date_of_issue: monthYear });
        }
    }

    const handleMonthYearChange = (monthYear) => setMonthYear(monthYear);

    const handleHeaderCheckboxChange = (event) => {
        if (event.target.checked) {
            setSelectedUsers(tableData.map(user => user));
            setAllChecked(true);
        } else {
            setSelectedUsers([]);
            setAllChecked(false);
        }
    };

    const handleCheckboxChange = (event, data) => {
        if (event.target.checked) {
            setSelectedUsers([...selectedUsers, data]);
        } else {
            setSelectedUsers(selectedUsers.filter(user => user._id !== data._id));
        }
    };

    function handleExportResult() {
        if (selectedUsers.length > 0) {
            setBack(true);
        } else {
            toast.info("Please Select students");
        }
    }

    return (
        <>
            {!back ? (
                <div>
                    <div className={style.NavContainer}>
                        <div className={style.Nav}>
                            <select name="stream" id="stream" defaultValue={""} onChange={(e) => setStream(e.target.value)}>
                                <option value="" disabled>Stream</option>
                                {departmentData?.department.map((data, i) => (
                                    <option key={i} value={data._id}>{data.stream}</option>
                                ))}
                            </select>
                            <select name="semester" id="semester" defaultValue={""} onChange={(e) => setSem(e.target.value)}>
                                <option value="" disabled>Select Semester</option>
                                <option value="1">Semester 1</option>
                                <option value="2">Semester 2</option>
                                <option value="3">Semester 3</option>
                                <option value="4">Semester 4</option>
                            </select>
                            <select name="examType" id="examType" defaultValue={""} onChange={(e) => setExamType(e.target.value)}>
                                <option value="" disabled>Select Exam Type</option>
                                <option value="regular">Regular</option>
                                <option value="non-regular">Non Regular</option>
                                <option value="atkt">ATKT</option>
                            </select>
                            <MonthYearPicker handleMonthYearChange={handleMonthYearChange} />

                            <button className={style.btn} onClick={handleFetch}>Get</button>
                        </div>
                        <div>
                            <button className={style.btnExport} onClick={handleExportResult}>Export Results</button>
                        </div>
                    </div>
                    <hr />
                    <div className={style.mainContainer}>
                        <table>
                            <thead>
                                <tr>
                                    <th style={{ width: "2rem" }}>
                                        <input type="checkbox" checked={allChecked} onChange={handleHeaderCheckboxChange} />
                                    </th>
                                    <th>RollNo</th>
                                    <th>Name</th>
                                    <th>Stream</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableData && tableData.map((data) => (
                                    <tr key={data._id}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selectedUsers.some(user => user._id === data._id)}
                                                onChange={(event) => handleCheckboxChange(event, data)}
                                            />
                                        </td>
                                        <td>{data?.student?.rollNo}</td>
                                        <td>{data?.student?.firstName} {data?.student?.fatherName} {data?.student?.lastName}</td>
                                        <td>{data?.stream?.stream}</td>
                                        <td>{data.status ? "Completed" : "Incompleted"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <PrintFace setBack={setBack} selectedUsers={selectedUsers} />
            )}
        </>
    );
}
