import React, { useState } from 'react';
import style from './faculty.module.css';
import { toast } from 'react-toastify';
import { useMutation, useQuery } from '@tanstack/react-query';
import { addFaculty, getDepartment, getSubject } from '../../../api/api';
import axios from 'axios';

export default function Faculty() {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const role = ['non', 'admin', 'teacher', 'hod'];
  const [streamId, setStreamId] = useState(null);

  // Fetch department data using useQuery
  const { data: departmentData, isLoading, error } = useQuery({
    queryKey: ['department'],
    queryFn: getDepartment,
  });

  // Fetch subjects based on selected department (streamId)
  const { data: subjectData, isLoading: isSubjectsLoading, error: subjectError } = useQuery({
    queryKey: ['semSubject', streamId],
    queryFn: () => getSubject(streamId),
    enabled: !!streamId, // Only fetch if streamId is not null

  });



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
        setFile(URL.createObjectURL(uploadedFile)); // Show image preview

        // Prepare data for Cloudinary upload
        const formData = new FormData();
        formData.append('file', uploadedFile);
        formData.append('upload_preset', 'gtk4v3ju'); // Cloudinary preset name

        try {
          // Upload image to Cloudinary
          const response = await axios.post(
            'https://api.cloudinary.com/v1_1/duvpop9lr/image/upload',
            formData
          );
          setImageUrl(response.data.secure_url); // Set Cloudinary image URL
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
  
    // Extract selected subjects for each semester
    const sem1Subjects = Array.from(e.target.sem1.selectedOptions).map(option => option.value);
    const sem2Subjects = Array.from(e.target.sem2.selectedOptions).map(option => option.value);
    const sem3Subjects = Array.from(e.target.sem3.selectedOptions).map(option => option.value);
    const sem4Subjects = Array.from(e.target.sem4.selectedOptions).map(option => option.value);
  
    // Create the faculty data payload
    const facultyData = {
      firstName: e.target.firstName.value,
      middleName: e.target.middleName.value,
      lastName: e.target.lastName.value,
      email: e.target.email.value,
      role: e.target.role.value,
      department: e.target.department.value,
      profile: imageUrl, // Cloudinary image URL
      subjects: {
        sem1: sem1Subjects,
        sem2: sem2Subjects,
        sem3: sem3Subjects,
        sem4: sem4Subjects,
      },
    };

    console.log(facultyData)
  
    // Send the data to the backend using the mutation
    addFacultyMutation.mutate(facultyData);
  };
  


  // ------------------- handleDepartmentWithSem function -------------
  function handleDepartmentWithSem(e) {
    e.preventDefault();
    setStreamId(e.target.value);
    // console.log(streamId)


  }



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


            {/* ============ Department Logic ans style ============ */}

            <div className={style.input_field}>
              <label htmlFor="department">Department:</label>
              {isLoading ? (
                <p>Loading departments...</p>
              ) : error ? (
                <p>Failed to load departments</p>
              ) : (
                <select id="department" onChange={handleDepartmentWithSem}>
                  {/* Check if departmentData is available */}
                  <option value="">NON</option>
                  {departmentData && departmentData.department && departmentData.department.length > 0 ? (
                    departmentData.department.map((dept) => (
                      <option key={dept._id} value={dept._id}>
                        {dept.stream}
                      </option>
                    ))
                  ) : (
                    <option value="non">NON</option> // Show "NON" if no departments
                  )}
                </select>
              )}
            </div>

          </div>

          {/* ============ Semister Logic ans style ============ */}

          <div className={style.inputConatiner}>
            {/* Sem 1 */}
            <div className={style.input_field}>
              <label htmlFor="email">Sem 1:</label>
              <select name="sem1" id="sem1" multiple>
                {
                  subjectData && subjectData?.sem1 && subjectData.sem1.length > 0 ? (
                    subjectData.sem1.map((sub) => (
                      <option value={sub._id} key={sub._id}>{sub.name}</option>
                    ))
                  ) : (
                    <option value="" disabled>NON</option>
                  )
                }
              </select>
            </div>
            {/* Sem 2 */}
            <div className={style.input_field}>
              <label htmlFor="email">Sem 2:</label>
              <select name="sem2" id="sem2" multiple>
                {
                  subjectData && subjectData?.sem2 && subjectData.sem2.length > 0 ? (
                    subjectData.sem2.map((sub) => (
                      <option value={sub._id} key={sub._id}>{sub.name}</option>
                    ))
                  ) : (
                    <option value="" disabled>NON</option>
                  )
                }
              </select>
            </div>
            {/* Sem 3 */}
            <div className={style.input_field}>
              <label htmlFor="email">Sem 3:</label>
              <select name="sem3" id="sem3" multiple>
                {
                  subjectData && subjectData?.sem3 && subjectData.sem3.length > 0 ? (
                    subjectData.sem3.map((sub) => (
                      <option value={sub._id} key={sub._id}>{sub.name}</option>
                    ))
                  ) : (
                    <option value="" disabled>NON</option>
                  )
                }
              </select>
            </div>




          </div>
          <div className={style.inputConatiner}>
            {/* Sem 4 */}
            <div className={style.input_field}>
              <label htmlFor="email">Sem 4:</label>
              <select name="sem4" id="sem4" multiple>
                {
                  subjectData && subjectData?.sem4 && subjectData.sem4.length > 0 ? (
                    subjectData.sem4.map((sub) => (
                      <option value={sub._id} key={sub._id}>{sub.name}</option>
                    ))
                  ) : (
                    <option value="" disabled>NON</option>
                  )
                }
              </select>
            </div>

            <div className={style.input_field}>
              <button type="submit" className={style.btn}>
                Submit
              </button>
            </div>
            <div className={style.input_field}></div>

          </div>


        </div>
      </div>
    </form>
  );
}
