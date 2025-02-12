import React, { useState } from 'react';
import axios from 'axios';
import style from './addStudent.module.css';
import { useMutation, useQuery } from '@tanstack/react-query';
import { addStudent, getDepartment } from '../../../api/api';
import { toast } from 'react-toastify';

const CLOUDINARY_URL = import.meta.env.VITE_APP_CLOUDINARY_API
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_APP_CLOUDINARY_PRESET_NAME;

export default function AddStudent() {
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  // ----------- Department get react query --------------
  const { data: departmentData, isLoading: departmentLoding, isError: departmentError } = useQuery(
    {
      queryKey: ['department'],
      queryFn: getDepartment,
    }
  );

  // ------------ submit student details -----------------
  const addStudentMutation = useMutation({
    mutationFn: addStudent,
    onSuccess: () => {
      toast.success('Successfully added student!');
      clearForm();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleDepartmentChange = (event) => {
    setSelectedDepartment(event.target.value);
  };

  const getAdmissionYears = () => {
    const department = departmentData?.department.find(dep => dep._id === selectedDepartment);
    return department ? department.addmissionYearsCode : {};
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const formatDateToDDMMYYYY = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${year}`;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    // Format admissionDate to dd-MM-yyyy
    const admissionDate = formData.get("admissionDate");
    if (admissionDate) {
      formData.set("admissionDate", formatDateToDDMMYYYY(admissionDate));
    }

    if (imageFile) {
      const cloudinaryFormData = new FormData();
      cloudinaryFormData.append('file', imageFile);
      cloudinaryFormData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

      try {
        const response = await axios.post(CLOUDINARY_URL, cloudinaryFormData);
        const imageUrl = response.data.secure_url;
        formData.append('profileUrl', imageUrl);
      } catch (error) {
        toast.error('Error uploading image to Cloudinary');
        console.error('Error uploading image to Cloudinary:', error);
      }
    }

    addStudentMutation.mutate(Object.fromEntries(formData.entries()));
  };

  const clearForm = () => {
    document.getElementById('add-student-form').reset();
    setSelectedDepartment('');
    setImagePreview(null);
    setImageFile(null);
  };

  const admissionYears = getAdmissionYears();

  return (
    <form id="add-student-form" className={style.form} onSubmit={handleSubmit}>
      <div className={style.container}>
        <div className={style.studentContainer}>
          <div className={style.imgContainer}>
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className={style.previewImage} />
            ) : (
              <label htmlFor="profileUrl" style={{ cursor: 'pointer' }}>
                Click Here to Upload
              </label>
            )}
            <input
              type="file"
              id="profileUrl"
              name='profileUrl'
              style={{ display: 'none' }}
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>

          <div className={style.inputContainer}>
            <div className={style.flexContainer}>
              <div className={style.inputBox}>
                <label htmlFor="firstName">Name: <span style={{ color: "red" }}>*</span></label>
                <input type="text" name="firstName" id="firstName" placeholder='name' required />
              </div>

              <div className={style.inputBox}>
                <label htmlFor="fatherName">Father Name: <span style={{ color: "red" }}>*</span></label>
                <input type="text" name="fatherName" id="fatherName" placeholder='father name' required />
              </div>

              <div className={style.inputBox}>
                <label htmlFor="lastName">Surname: <span style={{ color: "red" }}>*</span></label>
                <input type="text" name="lastName" id="lastName" placeholder='surname' required />
              </div>

              <div className={style.inputBox}>
                <label htmlFor="motherName">Mother Name: <span style={{ color: "red" }}>*</span></label>
                <input type="text" name="motherName" id="motherName" placeholder='mother name' required />
              </div>
            </div>

            <div className={style.flexContainer}>
              <div className={style.inputBox}>
                <label htmlFor="mobileNo">Mobile No: <span style={{ color: "red" }}>*</span></label>
                <input type="number" name="mobileNo" id="mobileNo" placeholder='mobile no' required />
              </div>

              <div className={style.inputBox}>
                <label htmlFor="date_Of_year">Date of Birth: <span style={{ color: "red" }}>*</span></label>
                <input type="date" name="date_Of_year" id="date_Of_year" placeholder='date of birth' required />
              </div>
            </div>

            <div className={style.flexContainer}>
              <div className={style.inputBox}>
                <label htmlFor="stream">Stream: <span style={{ color: "red" }}>*</span></label>
                <select name="stream" id="stream" defaultValue={""} onChange={handleDepartmentChange} required >
                  <option value="" disabled>Select Stream</option>
                  {
                    departmentData && departmentData.department &&
                    departmentData.department.map((data) => (
                      <option key={data._id} value={data._id}>{data.stream}</option>
                    ))
                  }
                </select>
              </div>

              <div className={style.inputBox}>
                <label htmlFor="codeId">Admission Year: <span style={{ color: "red" }}>*</span></label>
                <select name="codeId" id="codeId" defaultValue={""} required >
                  <option value="" disabled>Select Year</option>
                  {
                    Object.entries(admissionYears).map(([key, value]) => (
                      <option key={key} value={value}>{value}</option>
                    ))
                  }
                </select>
              </div>
            </div>

            <div className={style.flexContainer}>
              <div className={style.inputBox}>
                <label htmlFor="prn">PRN No: <span style={{ color: "red" }}>*</span></label>
                <input type="number" name="prn" id="prn" placeholder='PRN No' required />
              </div>

              <div className={style.inputBox}>
                <label htmlFor="admissionDate">Admission Date: <span style={{ color: "red" }}>*</span></label>
                <input type="date" name="admissionDate" id="admissionDate" placeholder='admission Date' required />
              </div>
            </div>
            <div className={style.inputBox}>
              <label htmlFor=""> _</label>
              <button className={style.btn} disabled={addStudentMutation.isPending}>{addStudentMutation.isPending ? "Submitting.." : "Submit"}</button>
            </div>

          </div>
        </div>
      </div>
    </form>
  );
}
