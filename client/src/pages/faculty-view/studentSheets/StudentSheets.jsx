import React, { useEffect, useState } from 'react'
import style from './studentSheets.module.css'
import YearPicker from '../../../common/YearPicker';
import MonthYearPicker from '../../../common/MonthYearPicker';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getDepartmentById, getStudentMarkForSpecificTeacher, getUserById, updateMark } from '../../../api/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'

export default function StudentSheets({ user }) {
    // ----------- State manage -----------
    const [monthYear, setMonthYear] = useState(null);
    const [subjectPer, setSubjectPer] = useState(null);
    const [selectedSem, setSelectedSem] = useState('');
    const [subjectId, setSubjectId] = useState(null);
    const [tableData, setTableData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        internal: null,
        external: null,
        credit: null
    })
    const [markValidtaion, setmarlValidation] = useState(null);



    // ------------- React query ----------------
    const { data: subjectData, isLoading, isError } = useQuery({
        queryKey: ["permisionSubject"],
        queryFn: (id) => getUserById(user._id),
    });

    const { data: departmentData } = useQuery({
        queryKey: ["department"],
        queryFn: () => user.department ? getDepartmentById(user.department) : Promise.reject('No department ID'),
        enabled: !!user.department, // Only run query if department exists
    });

    const { mutate: studentDataMutate } = useMutation({
        mutationFn: getStudentMarkForSpecificTeacher,
        mutationKey: ['student'],
        onSuccess: (data) => {
            if (data.length > 0) {
                toast.success('Successfully fetched students.');
                setTableData(data);
            }

            if (data.length === 0) {
                toast.info('NO data available');

            }
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
    const { mutate: updateSubjectMutate } = useMutation({
        mutationFn: updateMark,
        mutationKey: ['subject'],
        onSuccess: (data) => {
            toast.success('Successfully update subject.');
            navigate(0)
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    // --------------- Function --------
    const handleMonthYearChange = (monthYear) => setMonthYear(monthYear);
    function handleOnSelect(e) {
        const value = e.target.value;
        if (value === "1") setSubjectPer(subjectData.semester1Array);
        if (value === "2") setSubjectPer(subjectData.semester2Array);
        if (value === "3") setSubjectPer(subjectData.semester3Array);
        if (value === "4") setSubjectPer(subjectData.semester4Array);
        setSelectedSem(value);
    }


    // -------------  function --------------
    function handleFatchStudent() {
        if (subjectId && monthYear) {
            studentDataMutate({ subjectId, date_of_issue: monthYear })
        }


    }

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


    // --------- Manage Modal ----------
    // Open Modal
    const handleEdit = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };


    // Close Modal
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    function handleOnchangeInput(e) {
        const { name, value } = e.target;

        // Parse the value as a number
        const numericValue = value ? parseFloat(value) : ""; // Use parseFloat for decimals or parseInt if only integers are needed

        // Check if the new value is different from the current value
        if (numericValue !== formData[name]) {
            // Check if there is a max validation for the current field
            const maxValidationKey = `${name}Max`; // Example: "internalMax"
            const maxValue = markValidtaion?.[maxValidationKey];

            // Prevent values from exceeding the maximum
            if (maxValue && numericValue > maxValue) {
                toast.error(`Value for ${name} cannot exceed ${maxValue}`);
                return;
            }

            // Only update formData if the value is changed
            setFormData((prevFormData) => ({
                ...prevFormData,
                [name]: numericValue, // Store as number
            }));
        }
    }




    function handleUpdate(e) {
        e.preventDefault();

        // Check for practicalMark and practicalCredit if practical is enabled
        if (departmentData?.department?.practical) {
            if (formData.practicalMark === "" || formData.practicalCredit === "") {
                toast.error("Practical marks and practical credit are required.");
                return; // Prevent update if any practical field is missing
            }
        }

        // Validate other fields if necessary
        const validationErrors = Object.entries(formData).filter(([key, value]) => {
            const maxValidationKey = `${key}Max`; // e.g., "internalMax"
            const maxValue = markValidtaion?.[maxValidationKey];
            return maxValue && value > maxValue;
        });

        if (validationErrors.length > 0) {
            toast.error('One or more fields exceed the maximum allowed values.');
            return;
        }

        // Proceed with the update
        const updatedData = {
            ...formData,
            _id: selectedUser._id, // Attach the user's ID
        };

        // Update the backend and table data
        setTableData((prevData) =>
            prevData.map((data) =>
                data._id === selectedUser._id ? { ...data, ...updatedData } : data
            )
        );

        // Trigger backend update
        updateSubjectMutate(updatedData);

        closeModal(); // Close the modal after successful update
    }


    function handleDelete() {

    }
    console.log(formData)



    useEffect(() => {
        if (selectedUser) {
            let newFormData = {
                internal: selectedUser.internal || null,
                external: selectedUser.external || null,
                credit: selectedUser.credit || null
            };

            if (departmentData?.department?.practical) {
                // Only include practicalMark and practicalCredit if they exist in selectedUser and are not null
                newFormData = {
                    ...newFormData,
                    practicalMark: selectedUser.practicalMark || "",  // Default empty string if null
                    practicalCredit: selectedUser.practicalCredit || ""  // Default empty string if null
                };
            }

            setFormData(newFormData);
        }
    }, [selectedUser, departmentData]);  // Runs when either selectedUser or departmentData changes


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


                    {/* <YearPicker handleYearChange={handleYearChange} /> */}
                    <MonthYearPicker handleMonthYearChange={handleMonthYearChange} />
                </div>
                <button className={style.btnGetstd} onClick={handleFatchStudent}>Get</button>
            </div>
            <hr />
            <table>
                <thead>
                    <tr>
                        <th>Roll No</th>
                        <th>Name</th>
                        <th>subject</th>
                        <th>Int</th>
                        <th>Ext</th>
                        <th>Total</th>
                        <th>G</th>
                        <th>GP</th>
                        <th>CxG</th>
                        {
                            departmentData?.department?.practical === true && <th>Prac</th>
                        }
                        {
                            departmentData?.department?.practical === true && <th>G</th>
                        }
                        {
                            departmentData?.department?.practical === true && <th>GP</th>
                        }
                        {
                            departmentData?.department?.practical === true && <th>CxG</th>
                        }
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        tableData ? tableData.map((data, i) => (
                            <tr key={i}>
                                <td>{data.semesterId.student.rollNo}</td>
                                <td>{data.semesterId.student.firstName} {data.semesterId.student.fatherName} {data.semesterId.student.lastName}</td>
                                <td>{data.subjectName}</td>
                                <td>{data.internal}</td>
                                <td>{data.external}</td>
                                <td>{data.totalMark}</td>
                                <td>{data.grade}</td>
                                <td>{data.gradePoint}</td>
                                <td>{data.CPA}</td>
                                {
                                    departmentData?.department?.practical === true && <td>{data.practicalMark}</td>
                                }

                                {
                                    departmentData?.department?.practical === true && <td>{data.practicalGrade}</td>
                                }
                                {
                                    departmentData?.department?.practical === true && <td>{data.practicalGradePoint}</td>
                                }
                                {
                                    departmentData?.department?.practical === true && <td>{data.practicalCPA}</td>
                                }
                                <td><button onClick={() => handleEdit(data)}>Edit</button></td>
                            </tr>
                        )) :
                            (
                                <tr>
                                    <td colSpan={"14"}>No data Available</td>
                                </tr>
                            )
                    }
                </tbody>

            </table>
            {
                isModalOpen && selectedUser && (
                    <form>
                        <div className={style.modal}>
                            <div className={style.modalContainer}>
                                <h3>Here Update the Subject Marks</h3>
                                <hr />
                                <div className={style.inpFlex}>
                                    <div className={style.inpBox}>
                                        <label htmlFor="">Internal Marks</label>
                                        <input
                                            type="number"
                                            value={formData.internal || ""}
                                            onChange={handleOnchangeInput}
                                            name="internal"
                                            max={markValidtaion?.internalMax}
                                        />
                                    </div>
                                    <div className={style.inpBox}>
                                        <label htmlFor="">External Marks</label>
                                        <input
                                            type="number"
                                            value={formData.external || ""}
                                            onChange={handleOnchangeInput}
                                            name="external"
                                            max={markValidtaion?.externalMax}
                                        />
                                    </div>
                                    <div className={style.inpBox}>
                                        <label htmlFor="">Credit</label>
                                        <input
                                            type="number"
                                            value={formData.credit || ""}
                                            onChange={handleOnchangeInput}
                                            name="credit"
                                            max={markValidtaion?.credit}

                                        />
                                    </div>
                                    {departmentData?.department?.practical === true && (
                                        <>
                                            <div className={style.inpBox}>
                                                <label htmlFor="">Practical Mark</label>
                                                <input
                                                    type="number"
                                                    value={formData.practicalMark || ""}
                                                    onChange={handleOnchangeInput}
                                                    name="practicalMark"
                                                    max={markValidtaion?.practicalMax}
                                                />
                                            </div>
                                            <div className={style.inpBox}>
                                                <label htmlFor="">Practical Credit</label>
                                                <input
                                                    type="number"
                                                    value={formData.practicalCredit || ""}
                                                    onChange={handleOnchangeInput}
                                                    name="practicalCredit"
                                                    max={markValidtaion?.practicalCredit}
                                                />
                                            </div>
                                        </>
                                    )}

                                    <div className={style.btnContainer}>
                                        <button className={style.btnDelete} onClick={handleDelete}>
                                            Delete
                                        </button>
                                        <button className={style.btnUpdate} onClick={handleUpdate}>
                                            Update
                                        </button>
                                        <button className={style.btnCancel} onClick={closeModal}>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                )
            }

        </div>
    )
}
