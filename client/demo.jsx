import React, { useState } from 'react';
import style from './ViewFaculty.module.css';
import { useQuery } from '@tanstack/react-query';
import { getDepartment, getSubject, getUsers } from '../../../api/api';

const TABLE_HEAD = ["Profile", "Name", "Role", "Department", "Action"];

export default function ViewFaculty() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [streamId, setStreamId] = useState(null);
  const [file, setFile] = useState(null);



  const { data, isLoading, isError } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });


  // Fetch department data using useQuery
  const { data: departmentData, isLoading: departmentLoading, error } = useQuery({
    queryKey: ['department'],
    queryFn: getDepartment,
  });

  // Fetch subjects based on selected department (streamId)
  const { data: subjectData, isLoading: isSubjectsLoading, error: subjectError } = useQuery({
    queryKey: ['semSubject', streamId],
    queryFn: () => getSubject(streamId),
    enabled: !!streamId, // Only fetch if streamId is not null

  });

  const role = ['non', 'admin', 'teacher', 'hod'];

  // ------------------- handleDepartmentWithSem function -------------
  function handleDepartmentWithSem(e) {
    e.preventDefault();
    setStreamId(e.target.value);
    // console.log(streamId)


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
                    <button className={style.action_btn} onClick={() => handleEdit(body)}>Edit</button>
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
        <div className={style.modal}>
          <div className={style.modalContainer}>
            <div className={style.ImageContainer}>
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

            <div className={style.inpContainer}>
              <div className={style.inpBox}>
                <label htmlFor="">Name: </label>
                <input type="text" />
              </div>

              <div className={style.inpBox}>
                <label htmlFor="">Middle: </label>
                <input type="text" />
              </div>

              <div className={style.inpBox}>
                <label htmlFor="">Surname: </label>
                <input type="text" />
              </div>
            </div>

            <div className={style.inpContainer}>
              <div className={style.inpBox}>
                <label htmlFor="">Email: </label>
                <input type="text" />
              </div>

              <div className={style.inpBox}>
                <label htmlFor="role">Role:</label>
                <select id="role">
                  {role.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              <div className={style.inpBox}>
                <label htmlFor="department">Department:</label>
                {isLoading ? (
                  <p>Loading departments...</p>
                ) : isError ? (
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

            <div className={style.inpContainer}>
              {/* ============ Semister Logic ans style ============ */}
              {/* Sem 1 */}
              <div className={style.inpBox}>
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
              <div className={style.inpBox}>
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
              <div className={style.inpBox}>
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

            <div className={style.inpContainer}>
              <div className={style.inpBox}>
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

              <div className={style.btnContainer}>
                <div className={style.inpBox}>
                  <button className={style.updateBtn}>Update</button>
                </div>

                <div className={style.inpBox}>
                  <button className={style.deleteBtn}>Delete</button>
                </div>

                <div className={style.inpBox}>
                  <button className={style.cancelBtn} onClick={closeModal}>Cancel</button>
                </div>
              </div>
            </div>


          </div>
        </div>
      )}
    </div>
  );
}
