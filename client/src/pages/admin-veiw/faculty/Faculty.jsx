import React, { useState } from 'react';
import style from './faculty.module.css';
import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';
import { addFaculty } from '../../../api/api';
import axios from 'axios';

export default function Faculty() {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const role = ['non', 'admin', 'teacher', 'hod'];
  const department = ['non', 'bsc it', 'bcom', 'other'];

  // Mutation for sending faculty data to backend
  const addFacultyMutation = useMutation({
    mutationFn: addFaculty,
    onSuccess: () => {
      toast.success('Successfully added faculty!');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Cloudinary upload function
  const handleImageUpload = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const uploadedFile = e.target.files[0];
      const fileType = uploadedFile.type;

      // Validate if the uploaded file is an image
      if (fileType.startsWith('image/')) {
        setFile(URL.createObjectURL(uploadedFile));  // Show image preview

        // Prepare data for Cloudinary upload
        const formData = new FormData();
        formData.append('file', uploadedFile);
        formData.append('upload_preset', 'gtk4v3ju');  // Cloudinary preset name

        try {
          // Upload image to Cloudinary
          const response = await axios.post(
            'https://api.cloudinary.com/v1_1/duvpop9lr/image/upload',
            formData
          );
          setImageUrl(response.data.secure_url);  // Set Cloudinary image URL
        } catch (error) {
          toast.error('Failed to upload image to Cloudinary');
        }
      } else {
        toast.error('Please upload a valid image file.');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const facultyData = {
      firstName: e.target.firstName.value,
      middleName: e.target.middleName.value,
      lastName: e.target.lastName.value,
      email: e.target.email.value,
      role: e.target.role.value,
      department: e.target.department.value,
      profile: imageUrl,  // Cloudinary image URL
    };

    // console.log(facultyData)

    // Call your backend API to save faculty data
    addFacultyMutation.mutate(facultyData);
    
  };

  return (
    <form className={style.form} onSubmit={handleSubmit}>
      <div className={style.formContainer}>
        {/* Image upload and preview */}
        <div className={style.imageContainer}>
          {file ? (
            <img src={file} alt="Preview" className={style.previewImage} />
          ) : (
            <span className={style.placeholder}>Click to upload image</span>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className={style.fileInput}
          />
        </div>

        {/* Input fields */}
        <div className={style.inputMainContainer}>
          <div className={style.inputConatiner}>
            <div className={style.input_field}>
              <label htmlFor="firstName">Name:</label>
              <input type="text" id="firstName" placeholder="Enter first name" />
            </div>
            <div className={style.input_field}>
              <label htmlFor="middleName">Middle Name:</label>
              <input type="text" id="middleName" placeholder="Enter middle name" />
            </div>
            <div className={style.input_field}>
              <label htmlFor="lastName">Last Name:</label>
              <input type="text" id="lastName" placeholder="Enter last name" />
            </div>
          </div>

          <div className={style.inputConatiner}>
            <div className={style.input_field}>
              <label htmlFor="email">Email:</label>
              <input type="email" id="email" placeholder="example@gmail.com" />
            </div>

            <div className={style.input_field}>
              <label htmlFor="role">Role:</label>
              <select id="role">
                {role.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div className={style.input_field}>
              <label htmlFor="department">department:</label>
              <select id="department">
                {department.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button type="submit" className={style.btn}>
            Submit
          </button>
        </div>
      </div>
    </form>
  );
}
