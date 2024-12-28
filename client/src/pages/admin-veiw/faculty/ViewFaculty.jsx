import React, { useEffect, useState } from 'react';
import style from './ViewFaculty.module.css';
import { useMutation, useQuery } from '@tanstack/react-query';
import { deleteFaculty, getDepartment, getSubject, getUsers, updateFaculty } from '../../../api/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TABLE_HEAD = ["Profile", "Name", "Role", "Department", "Action"];

export default function ViewFaculty() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [streamId, setStreamId] = useState(null);
  const [file, setFile] = useState(null);
  const role = ['non', 'admin', 'teacher', 'hod'];
  const [imageUrl, setImageUrl] = useState('');
  const navigate = useNavigate()

  console.log(selectedUser?.profile)

  const { data, isLoading, isError } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });


  // Fetch department data using useQuery
  const { data: departmentData, isLoading: departmentLoading, error: departmentError } = useQuery({
    queryKey: ['department'],
    queryFn: getDepartment,
  });

  // Fetch subjects based on selected department (streamId)
  const { data: subjectData, isLoading: isSubjectsLoading, error: subjectError } = useQuery({
    queryKey: ['semSubject', streamId],
    queryFn: () => getSubject(streamId),
    enabled: !!streamId, // Only fetch if streamId is not null

  });

  //  ============== Update Users =========
  // Mutation for sending faculty data to backend
  const updateFacultyMutation = useMutation({
    mutationFn: updateFaculty,
    onSuccess: () => {
      toast.success('Successfully Update faculty!');
      navigate(0)
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  //  ============== Update Users =========
  // Mutation for sending faculty data to backend
  const deleteFacultyMutation = useMutation({
    mutationFn: deleteFaculty,
    onSuccess: () => {
      toast.success('Successfully Delete faculty!');
      navigate(0)
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });




  // ------------------- handleDepartmentWithSem function -------------
  function handleDepartmentWithSem(data, e) {
    // e.preventDefault();
    setStreamId(e.target.value);
    // console.log(data)


  }


  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading data</div>;
  }

  const TABLE_ROWS = data?.users || [];

  // Handle Search
  const filteredRows = TABLE_ROWS.filter((row) => {
    const fullName = `${row.firstName} ${row.middleName || ""} ${row.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  // Handle Sort
  const sortedRows = [...filteredRows].sort((a, b) => {
    if (!sortConfig.key) return 0; // No sorting applied

    const aValue = sortConfig.key === "name"
      ? `${a.firstName} ${a.middleName || ""} ${a.lastName}`.toLowerCase()
      : sortConfig.key === "department"
        ? a?.department?.stream?.toLowerCase()
        : a[sortConfig.key]?.toLowerCase();

    const bValue = sortConfig.key === "name"
      ? `${b.firstName} ${b.middleName || ""} ${b.lastName}`.toLowerCase()
      : sortConfig.key === "department"
        ? b?.department?.stream?.toLowerCase()
        : b[sortConfig.key]?.toLowerCase();

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  // Change Sort Config
  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        // Toggle direction if the same key is clicked
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" }; // Default to ascending
    });
  };

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
      profile: !imageUrl ? selectedUser?.profile : imageUrl, // Cloudinary image URL
      subjects: {
        sem1: sem1Subjects,
        sem2: sem2Subjects,
        sem3: sem3Subjects,
        sem4: sem4Subjects,
      },
    };

    console.log(facultyData)


    // Send the data to the backend using the mutation
    updateFacultyMutation.mutate(facultyData);
  };


  function handleDelete(user, e) {
    e.preventDefault();
    console.log(user); // This will log the selected user object
    deleteFacultyMutation.mutate(user); // Pass the selectedUser directly, or pass user._id if needed
  }
  


  return (
    <div className={style.container}>
      <div className={style.controls}>
        <input
          type="text"
          placeholder="Search by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={style.searchInput}
        />
      </div>

      <div className={style.table_container}>
        <table>
          <thead>
            <tr>
              {TABLE_HEAD.map((head, index) => (
                <th
                  key={head}
                  onClick={() => handleSort(head.toLowerCase())}
                  className={index !== 4 ? style.sortable : ""}
                >
                  {head} {sortConfig.key === head.toLowerCase() ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedRows.length > 0 ? (
              sortedRows.map((body, i) => (
                <tr key={i}>
                  <td>
                    <img src={body.profile} alt="Profile" className={style.imgContainer} />
                  </td>
                  <td>{body.firstName} {body.middleName} {body.lastName}</td>
                  <td>{body.role}</td>
                  <td>{body?.department?.stream}</td>
                  <td>
                    <button className={style.action_btn} onClick={(e) => handleEdit(body)}>Edit</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={TABLE_HEAD.length}>No Data</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && selectedUser && (
        <form onSubmit={handleSubmit}>
          <div className={style.modal}>
            <div className={style.modalContainer}>
              <div className={style.ImageContainer} onClick={() => document.getElementById('fileInput').click()}>
                {file || selectedUser?.profile ? (
                  <img
                    src={file || selectedUser?.profile} // Use file if available, otherwise use selectedUser.profile
                    alt="Preview"
                    className={style.previewImage}
                  />
                ) : (
                  <span className={style.placeholder}>Click to upload image</span>
                )}
                <input
                  type="file"
                  id="fileInput"  // Adding id to the input for reference
                  accept="image/*"
                  onChange={handleImageUpload}
                  className={style.fileInput}
                  style={{ display: 'none' }}  // Hide the file input
                />
              </div>



              <div className={style.inpContainer}>
                <div className={style.inpBox}>
                  <label htmlFor="">Name: </label>
                  <input
                    type="text"
                    name='firstName'
                    value={selectedUser.firstName}
                    onChange={(e) => setSelectedUser({ ...selectedUser, firstName: e.target.value })}
                  />
                </div>

                <div className={style.inpBox}>
                  <label htmlFor="">Middle: </label>
                  <input
                    type="text"
                    name='middleName'
                    value={selectedUser.middleName}
                    onChange={(e) => setSelectedUser({ ...selectedUser, middleName: e.target.value })}
                  />
                </div>

                <div className={style.inpBox}>
                  <label htmlFor="">Surname: </label>
                  <input
                    type="text"
                    value={selectedUser.lastName}
                    name='lastName'
                    onChange={(e) => setSelectedUser({ ...selectedUser, lastName: e.target.value })}
                  />
                </div>
              </div>

              <div className={style.inpContainer}>
                <div className={style.inpBox}>
                  <label htmlFor="">Email: </label>
                  <input
                    type="text"
                    name='email'
                    value={selectedUser.email}
                    onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                  />
                </div>

                <div className={style.inpBox}>
                  <label htmlFor="role">Role:</label>
                  <select
                    id="role"
                    value={selectedUser.role}
                    name='role'
                    onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                  >
                    {role.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={style.inpBox}>
                  <label htmlFor="department">Department:</label>
                  {departmentLoading ? (
                    <p>Loading departments...</p>
                  ) : departmentError ? (
                    <p>Failed to load departments</p>
                  ) : (
                    <select
                      id="department"
                      name='department'
                      value={selectedUser.department?.stream || ""}
                      // defaultValue={selectedUser?.department?.stream}
                      onChange={(e) => {
                        // Call handleDepartmentWithSem only if selectedUser.department.stream exists
                        if (selectedUser.department?.stream) {
                          handleDepartmentWithSem(departmentData, e);
                        }
                      }}
                    >
                      {/* If a department is selected (i.e., selectedUser.department.stream exists), display it */}
                      {selectedUser.department?.stream ? (
                        <option value={selectedUser.department._id}>
                          {selectedUser.department.stream}
                        </option>
                      ) : (
                        // Default "NON" option if no department is selected
                        <option value="">NON</option>
                      )}

                      {/* Show all departments from the fetched data */}
                      {departmentData?.department && departmentData.department.length > 0 ? (
                        departmentData.department.map((dept) => (
                          <option key={dept._id} value={dept._id}>
                            {dept.stream}
                          </option>
                        ))
                      ) : (
                        <option value="non">NON</option> // Fallback option if no departments are available
                      )}
                    </select>
                  )}
                </div>


              </div>



              <div className={style.inpContainer}>
                {/* Semester Logic */}
                {/* Sem 1 */}
                <div className={style.inpBox}>
                  <label htmlFor="sem1">Sem 1:</label>
                  <select
                    name="sem1"
                    id="sem1"
                    multiple
                    value={selectedUser?.subjects?.sem1 || []} // Bind the value to selectedUser.subjects.sem1
                    onChange={(e) => {
                      const selectedValues = Array.from(e.target.selectedOptions, option => option.value);
                      setSelectedUser((prev) => ({
                        ...prev,
                        subjects: {
                          ...prev.subjects,
                          sem1: selectedValues,
                        },
                      }));
                    }}
                  >
                    {
                      subjectData && subjectData?.sem1 && subjectData.sem1.length > 0 ? (
                        subjectData.sem1.map((sub) => (
                          <option value={sub._id} key={sub._id}>
                            {sub.name}
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>NON</option>
                      )
                    }
                  </select>
                </div>
                {/* Sem 2 */}
                <div className={style.inpBox}>
                  <label htmlFor="sem2">Sem 2:</label>
                  <select
                    name="sem2"
                    id="sem2"
                    multiple
                    value={selectedUser?.subjects?.sem2 || []} // Bind the value to selectedUser.subjects.sem1
                    onChange={(e) => {
                      const selectedValues = Array.from(e.target.selectedOptions, option => option.value);
                      setSelectedUser((prev) => ({
                        ...prev,
                        subjects: {
                          ...prev.subjects,
                          sem1: selectedValues,
                        },
                      }));
                    }}
                  >
                    {
                      subjectData && subjectData?.sem2 && subjectData.sem2.length > 0 ? (
                        subjectData.sem2.map((sub) => (
                          <option value={sub._id} key={sub._id}>
                            {sub.name}
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>NON</option>
                      )
                    }
                  </select>
                </div>

                {/* Sem 3 */}
                <div className={style.inpBox}>
                  <label htmlFor="sem3">Sem 3:</label>
                  <select
                    name="sem3"
                    id="sem3"
                    multiple
                    value={selectedUser?.subjects?.sem1 || []} // Bind the value to selectedUser.subjects.sem1
                    onChange={(e) => {
                      const selectedValues = Array.from(e.target.selectedOptions, option => option.value);
                      setSelectedUser((prev) => ({
                        ...prev,
                        subjects: {
                          ...prev.subjects,
                          sem1: selectedValues,
                        },
                      }));
                    }}
                  >
                    {
                      subjectData && subjectData?.sem3 && subjectData.sem3.length > 0 ? (
                        subjectData.sem1.map((sub) => (
                          <option value={sub._id} key={sub._id}>
                            {sub.name}
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>NON</option>
                      )
                    }
                  </select>
                </div>

                {/* Sem 4 */}
                <div className={style.inpBox}>
                  <label htmlFor="sem4">Sem 4:</label>
                  <select
                    name="sem4"
                    id="sem4"
                    multiple
                    value={selectedUser?.subjects?.sem1 || []} // Bind the value to selectedUser.subjects.sem1
                    onChange={(e) => {
                      const selectedValues = Array.from(e.target.selectedOptions, option => option.value);
                      setSelectedUser((prev) => ({
                        ...prev,
                        subjects: {
                          ...prev.subjects,
                          sem1: selectedValues,
                        },
                      }));
                    }}
                  >
                    {
                      subjectData && subjectData?.sem4 && subjectData.sem4.length > 0 ? (
                        subjectData.sem4.map((sub) => (
                          <option value={sub._id} key={sub._id}>
                            {sub.name}
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>NON</option>
                      )
                    }
                  </select>
                </div>

              </div>



              <div className={style.btnContainer}>
                <div className={style.inpBox}>
                  <button className={style.updateBtn} type='submit' >Update</button>
                </div>

                <div className={style.inpBox}>
                  <button className={style.deleteBtn} onClick={(e) => handleDelete(selectedUser, e)}>Delete</button>

                </div>

                <div className={style.inpBox}>
                  <button className={style.cancelBtn} onClick={closeModal}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
