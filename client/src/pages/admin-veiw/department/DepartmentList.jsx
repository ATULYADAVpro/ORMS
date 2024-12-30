import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import style from './departmentList.module.css';
import { deleteDepartment, getDepartment, updateDepartment } from '../../../api/api';
import { toast } from 'react-toastify';

export default function DepartmentList() {
    const TABLE_ROW = ["Stream", "Practical", "Admission Year Code", "Action"];
    const queryClient = useQueryClient();
    const [search, setSearch] = useState('');
    const [filteredDepartments, setFilteredDepartments] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState({
        "stream": "",
        "code": "",
        "practical": false,
        "addmissionYearsCode": {
            "FY": "",
            "SY": "",
            "TY": ""
        }
    });

    // react-query manage department API calling
    const { data: departmentData, isLoading: departmentLoading, isError: departmentError } = useQuery({
        queryFn: getDepartment,
        queryKey: ['department']
    });

    // update department mutate
    const { mutate: updateDepartmentMutate, isLoading: isUpdating } = useMutation({
        mutationFn: updateDepartment,
        onSuccess: () => {
            queryClient.invalidateQueries(['department'])
            toast.success('Successfully updated department!');
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    // delete department mutate
    const { mutate: deleteDepartmentMutate, isLoading: isDeleting } = useMutation({
        mutationFn: deleteDepartment,
        onSuccess: () => {
            queryClient.invalidateQueries(['department'])
            toast.success('Successfully deleted department!');
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    useEffect(() => {
        if (departmentData && departmentData.department.length > 0) {
            setFilteredDepartments(
                departmentData.department.filter(department =>
                    department.stream.toLowerCase().includes(search.toLowerCase())
                )
            );
        }
    }, [search, departmentData]);

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

    // Handle Modal Input Change
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Handle nested objects for admission years code
        if (name === "FY" || name === "SY" || name === "TY") {
            setSelectedUser((prev) => ({
                ...prev,
                addmissionYearsCode: {
                    ...prev.addmissionYearsCode,
                    [name]: value,
                }
            }));
        } else {
            setSelectedUser((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    function handleUpdate(data, e) {
        updateDepartmentMutate(data);
        setIsModalOpen(false);
    }

    function handleDelete(data, e) {
        deleteDepartmentMutate(data);
        setIsModalOpen(false);
    }

    return (
        <div className={style.container}>
            {/* Navbar container */}
            <div className={style.navbar}>
                <nav>
                    <ul></ul>
                    <div className={style.search_container}>
                        <input
                            type="search"
                            className={style.search_input}
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </nav>
            </div>

            {/* =============== Main Content ============ */}
            <div className={style.mainContainer}>
                <table>
                    <thead>
                        {/* ======= Header of Table ===== */}
                        <tr>
                            {TABLE_ROW.map((data, i) => (
                                <th key={i}>{data}</th>
                            ))}
                        </tr>
                    </thead>

                    {/* =========== Body of the Table ===== */}
                    <tbody>
                        {filteredDepartments && filteredDepartments.length > 0 ? (
                            filteredDepartments.map((data, i) => (
                                <tr key={i}>
                                    <td>{data.stream}</td>
                                    <td>{data.practical ? "Yes" : "No"}</td>
                                    <td>{data.addmissionYearsCode?.FY}, {data.addmissionYearsCode?.SY}, {data.addmissionYearsCode?.TY}</td>
                                    <td>
                                        <button className={style.btnEdit} onClick={() => handleEdit(data)}>Edit</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={TABLE_ROW.length}>NO data available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal of subject */}
            {isModalOpen && selectedUser && (
                <div className={style.modal}>
                    <div className={style.modalContainer}>
                        <div className={style.inpContainer}>
                            <div className={style.flexBox}>
                                <div className={style.inpBox}>
                                    <label htmlFor="stream">Stream: </label>
                                    <input type="text" name="stream" value={selectedUser.stream} onChange={handleInputChange} required />
                                </div>
                                <div className={style.inpBox}>
                                    <label htmlFor="code">Code: </label>
                                    <input type="text" name="code" value={selectedUser.code} onChange={handleInputChange} required />
                                </div>
                            </div>
                            <div className={style.flexBox}>
                                <div className={style.inpBox}>
                                    <label htmlFor="practicalName">Practical:</label>
                                    <select name="practical" id="practical" value={selectedUser.practical} onChange={handleInputChange} required>
                                        <option value="true">True</option>
                                        <option value="false">False</option>
                                    </select>
                                </div>
                                <div className={style.inpBox}>
                                    <label htmlFor="FY">First Year: </label>
                                    <input type="text" name="FY" value={selectedUser?.addmissionYearsCode?.FY} onChange={handleInputChange} required />
                                </div>
                            </div>
                            <div className={style.flexBox}>
                                <div className={style.inpBox}>
                                    <label htmlFor="SY">Second Year: </label>
                                    <input type="text" name="SY" value={selectedUser?.addmissionYearsCode?.SY} onChange={handleInputChange} required />
                                </div>
                                <div className={style.inpBox}>
                                    <label htmlFor="TY">Third Year: </label>
                                    <input type="text" name="TY" value={selectedUser?.addmissionYearsCode?.TY} onChange={handleInputChange} required />
                                </div>
                            </div>
                        </div>
                        <div className={style.btnContainer}>
                            <div className={style.inpBox}>
                                <button className={style.updateBtn} type='submit' onClick={(e) => handleUpdate(selectedUser, e)}>Update</button>
                            </div>
                            <div className={style.inpBox}>
                                <button className={style.deleteBtn} onClick={(e) => handleDelete(selectedUser, e)}>Delete</button>
                            </div>
                            <div className={style.inpBox}>
                                <button className={style.cancelBtn} onClick={closeModal}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
