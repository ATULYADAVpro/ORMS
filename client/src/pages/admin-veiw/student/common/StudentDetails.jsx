import React, { useState } from 'react';
import style from './studentDetails.module.css';
import SemisterDataForSD from './SemisterDataForSD';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteStudent, getActiveSemester, getDepartment, updateStudent } from '../../../../api/api';
import { toast } from 'react-toastify';
import uploadImageToCloudinary from './uploadImageToCloudinary'; // Import the image upload handler

const StudentDetails = ({ selectedStudent, onBack }) => {
    const { data: departmentData, isLoading: departmentLoading, isError: departmentError } = useQuery({
        queryKey: ['department'],
        queryFn: getDepartment
    });
    const queryClient = useQueryClient();
    const [isEditable, setIsEditable] = useState(false);
    const [student, setStudent] = useState(selectedStudent);
    const [profileImage, setProfileImage] = useState(null);
    const [profilePreview, setProfilePreview] = useState(selectedStudent.profileUrl);
    const [semData, setSemData] = useState(null)




    const { mutate: studentSemDataMuate } = useMutation({
        mutationFn: getActiveSemester,
        onSuccess: (data) => {
            toast.success('Successfull');
            setSemData(data)
            // queryClient.invalidateQueries(['students']);
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
    const updateMutation = useMutation({
        mutationFn: updateStudent,
        onSuccess: () => {
            toast.success('Successfully Updated Student details.');
            queryClient.invalidateQueries(['students']);
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteStudent,
        onSuccess: () => {
            toast.success('Successfully Delete Student details.');
            queryClient.invalidateQueries(['students']);
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setStudent((prevStudent) => ({
            ...prevStudent,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setProfileImage(file);
        setProfilePreview(URL.createObjectURL(file)); // Set the preview URL
    };

    const handleReadClick = () => {
        setIsEditable((pre => !pre));

    };

    const getUpdatedFields = (original, updated) => {
        let updatedFields = {};
        for (let key in updated) {
            if (updated[key] !== original[key]) {
                updatedFields[key] = updated[key];
            }
        }
        return updatedFields;
    };

    const handleUpdateClick = async () => {
        let updatedFields = getUpdatedFields(selectedStudent, student);

        if (profileImage) {
            try {
                const profileUrl = await uploadImageToCloudinary(profileImage);
                console.log('Uploaded to Cloudinary:', profileUrl);
                updatedFields.profileUrl = profileUrl;
                setStudent((prevStudent) => ({
                    ...prevStudent,
                    profileUrl: profileUrl
                }));
            } catch (error) {
                toast.error("Failed to upload profile image.");
                return;
            }
        }

        if (Object.keys(updatedFields).length > 0) {
            updateMutation.mutate({
                rollNo: student.rollNo,
                mobileNo: student.mobileNo,
                ...updatedFields
            });
        } else {
            toast.info("No changes detected to update.");
        }
        setIsEditable(false);
    };

    const handleDeleteClick = () => {
        deleteMutation.mutate(student);
        onBack();
    };

    const handleImageClick = () => {
        document.getElementById('profileImageInput').click();
    };


    // console.log(student.semesters)


    function handleFatchSemDataActive() {
        if (student.semesters || student.semesters.length > 0) {
            studentSemDataMuate(student.semesters)
        } else {
            toast.info("this semester haven't active or empty")
        }
    }





    return (
        <div className={style.studentDetails}>
            <button onClick={onBack} className={style.btnBack}>Back</button>

            <div className={style.mainDetailsContainer}>
                <div className={style.imgContainer} onClick={isEditable ? handleImageClick : null}>
                    <img src={profilePreview} alt="Profile" />
                    <input
                        type="file"
                        accept="image/*"
                        id="profileImageInput"
                        style={{ display: 'none' }}
                        onChange={handleImageChange}
                    />
                </div>

                <div className={style.detailsContainer}>
                    <div className={style.inpContainer}>
                        <div className={style.inpBox}>
                            <label htmlFor="firstName">Name:</label>
                            <input
                                type="text"
                                name="firstName"
                                id="firstName"
                                value={student.firstName}
                                onChange={handleInputChange}
                                disabled={!isEditable}
                            />
                        </div>

                        <div className={style.inpBox}>
                            <label htmlFor="fatherName">Father Name:</label>
                            <input
                                type="text"
                                name="fatherName"
                                id="fatherName"
                                value={student.fatherName}
                                onChange={handleInputChange}
                                disabled={!isEditable}
                            />
                        </div>

                        <div className={style.inpBox}>
                            <label htmlFor="lastName">Surname:</label>
                            <input
                                type="text"
                                name="lastName"
                                id="lastName"
                                value={student.lastName}
                                onChange={handleInputChange}
                                disabled={!isEditable}
                            />
                        </div>
                    </div>

                    <div className={style.inpContainer}>
                        <div className={style.inpBox}>
                            <label htmlFor="motherName">Mother Name:</label>
                            <input
                                type="text"
                                name="motherName"
                                id="motherName"
                                value={student.motherName}
                                onChange={handleInputChange}
                                disabled={!isEditable}
                            />
                        </div>

                        <div className={style.inpBox}>
                            <label htmlFor="mobileNo">Mobile No:</label>
                            <input
                                type="text"
                                name="mobileNo"
                                id="mobileNo"
                                value={student.mobileNo}
                                onChange={handleInputChange}
                                disabled={!isEditable}
                            />
                        </div>

                        <div className={style.inpBox}>
                            <label htmlFor="date_Of_year">DOB:</label>
                            <input
                                type="text"
                                name="date_Of_year"
                                id="date_Of_year"
                                value={student.date_Of_year}
                                onChange={handleInputChange}
                                disabled={!isEditable}
                            />
                        </div>
                    </div>

                    <div className={style.inpContainer}>
                        <div className={style.inpBox}>
                            <label htmlFor="rollNo">Roll No:</label>
                            <input
                                type="text"
                                name="rollNo"
                                id="rollNo"
                                value={student.rollNo}
                                onChange={handleInputChange}
                                disabled={!isEditable}
                            />
                        </div>

                        <div className={style.inpBox}>
                            <label htmlFor="stream">Stream:</label>
                            <select
                                name="stream"
                                id="stream"
                                value={student.stream._id}
                                onChange={handleInputChange}
                                disabled={!isEditable}
                            >
                                {departmentData?.department && departmentData.department.map((data, i) => (
                                    <option value={data._id} key={i}>{data.stream}</option>
                                ))}
                            </select>
                        </div>

                        <div className={style.inpBox}>
                            <label htmlFor="admissionDate">Admission Date:</label>
                            <input
                                type="text"
                                name="admissionDate"
                                id="admissionDate"
                                value={student.admissionDate}
                                onChange={handleInputChange}
                                disabled={!isEditable}
                            />
                        </div>
                    </div>
                </div>

                <div className={style.btnContainer}>
                    <button onClick={handleReadClick} className={style.btnRead}>Read</button>
                    <button onClick={handleUpdateClick} className={style.btnUpdate} disabled={updateMutation.isPending}>{updateMutation.isPending ? "Updating.." : "Update"}</button>
                    <button onClick={handleDeleteClick} className={style.btnDelete} disabled={deleteMutation.isPending}>{deleteMutation.isPending ? "Deleting.." : "Delete"}</button>
                </div>
            </div>

            <div className={style.moreBtnContainer}>

                <button className={style.more} onClick={handleFatchSemDataActive}>More</button>
            </div>

            {
                semData && semData.map((data,i) => {
                    {/* console.log(data) */}
                    return (
                        <SemisterDataForSD key={i} data={data} student={student} semData={semData} />
                    )
                })
            }

        </div>
    );
};

export default StudentDetails;
