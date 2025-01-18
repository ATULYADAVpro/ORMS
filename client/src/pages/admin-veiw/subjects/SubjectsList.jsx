import { useMutation, useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import style from './subjectList.module.css';
import { deleteSubject, getAllSubject, getDepartment, updateSubject } from '../../../api/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function SubjectsList() {
    const TABLE_ROW = ["Subject Code", "Subject Name", "Practical Code", "Practical Name", "Stream", "Action"];

    const [stream, setStream] = useState('All');
    const [sem, setSem] = useState('All');
    const [search, setSearch] = useState('');
    const [filteredSubjects, setFilteredSubjects] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const navigate = useNavigate()


    // react-query manage subjects API calling
    const { data: subjectData, isPending: subjectLoading, isError: subjectError } = useQuery({
        queryFn: getAllSubject,
        queryKey: ['subjects']
    });

    // react-query manage department API calling
    const { data: departmentData, isPending: departmentLoading, isError: departmentError } = useQuery({
        queryFn: getDepartment,
        queryKey: ['department']
    });

    // Mutation for update subject 
    const updateSubjectMutation = useMutation({
        mutationFn: updateSubject,
        onSuccess: () => {
            toast.success('Successfully Update Subject!');
            navigate(0)
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
    // Mutation for update subject 
    const deleteSubjectMutation = useMutation({
        mutationFn: deleteSubject,
        onSuccess: () => {
            toast.error('Successfully Delete Subject!');
            navigate(0)
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });


    useEffect(() => {
        if (subjectData) {
            let filtered = subjectData.result;

            if (stream !== 'All') {
                filtered = filtered.filter(subject => subject.stream._id === stream);
            }

            if (sem !== 'All') {
                filtered = filtered.filter(subject => subject.sem === sem);
            }

            if (search) {
                filtered = filtered.filter(subject =>
                    subject.code.toLowerCase().includes(search.toLowerCase()) ||
                    subject.name.toLowerCase().includes(search.toLowerCase())
                );
            }

            setFilteredSubjects(filtered);
        }
    }, [subjectData, stream, sem, search]);

    if (subjectLoading || departmentLoading) {
        return <div>Loading...</div>;
    }

    if (subjectError || departmentError) {
        return <div>Error loading data</div>;
    }

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
        setSelectedUser((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    function handleUpdate(data, e) {
        updateSubjectMutation.mutate(data)
    }

    function handleDelete(data, e) {
        deleteSubjectMutation.mutate(data)
    }

    return (
        <div className={style.container}>
            {/* Navbar container */}
            <div className={style.navbar}>
                <nav>
                    <ul>
                        {/* Selection of stream */}
                        <li>
                            <select name="stream" id="stream" value={stream} onChange={(e) => setStream(e.target.value)}>
                                <option value="All">All</option>
                                {departmentData && departmentData.department.length > 0 ? (
                                    departmentData.department.map((data) => (
                                        <option value={data._id} key={data._id}>
                                            {data.stream}
                                        </option>
                                    ))
                                ) : (
                                    <option disabled>No data available</option>
                                )}
                            </select>
                        </li>

                        {/* Selection of sem */}
                        <li>
                            <select name="sem" id="sem" value={sem} onChange={(e) => setSem(e.target.value)}>
                                <option value="All">All</option>
                                <option value="1">Sem 1</option>
                                <option value="2">Sem 2</option>
                                <option value="3">Sem 3</option>
                                <option value="4">Sem 4</option>
                                {/* Add more semesters as needed */}
                            </select>
                        </li>
                    </ul>
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
                        {filteredSubjects.length > 0 ? (
                            filteredSubjects.map((data, i) => (
                                <tr key={i}>
                                    <td>{data.code}</td>
                                    <td>{data.name}</td>
                                    <td>{data.practicalCode ? data.practicalCode : "N/N"}</td>
                                    <td>{data.practicalName ? data.practicalName : "N/N"}</td>
                                    <td>{data?.stream?.stream}</td>
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
                            <div className={style.inpBox}>
                                <label htmlFor="name">Subject Name: </label>
                                <input type="text" name="name" value={selectedUser.name} onChange={handleInputChange} />
                            </div>

                            <div className={style.inpBox}>
                                <label htmlFor="code">Subject Code: </label>
                                <input type="text" name="code" value={selectedUser.code} onChange={handleInputChange} />
                            </div>

                            <div className={style.inpBox}>
                                <label htmlFor="credit">Credit:</label>
                                <input type="number" name="credit" value={selectedUser.credit} required onChange={handleInputChange} placeholder="Credit" />
                            </div>
                            <div className={style.flexBox}>
                                <div className={style.inpBox}>
                                    <label htmlFor="internalMax">Internal Max: </label>
                                    <input type="number" name="internalMax" value={selectedUser.internalMax} required onChange={handleInputChange} placeholder="Internal Max" />
                                </div>

                                <div className={style.inpBox}>
                                    <label htmlFor="internalMin">Internal Min:</label>
                                    <input type="number" name="internalMin" value={selectedUser.internalMin} required onChange={handleInputChange} placeholder="Internal Min" />
                                </div>
                            </div>

                            <div className={style.flexBox}>
                                <div className={style.inpBox}>
                                    <label htmlFor="externalMax">External Max: </label>
                                    <input type="number" name="externalMax" value={selectedUser.externalMax} required onChange={handleInputChange} placeholder="External Max" />
                                </div>

                                <div className={style.inpBox}>
                                    <label htmlFor="externalMin">External Min:</label>
                                    <input type="number" name="externalMin" value={selectedUser.externalMin} required onChange={handleInputChange} placeholder="External Min" />
                                </div>
                            </div>
                            <div className={style.flexBox}>
                                <div className={style.inpBox}>
                                    <label htmlFor="totalMax">Total Max: </label>
                                    <input type="number" name="totalMax" value={selectedUser.totalMax} required onChange={handleInputChange} placeholder="Total Max" />
                                </div>

                                <div className={style.inpBox}>
                                    <label htmlFor="totalMin">Total Min:</label>
                                    <input type="number" name="totalMin" value={selectedUser.totalMin} required onChange={handleInputChange} placeholder="Total Min" />
                                </div>
                            </div>

                            {selectedUser.practicalName && selectedUser.practicalCode && (
                                <>
                                    <div className={style.inpBox}>
                                        <label htmlFor="practicalName">Practical Name: </label>
                                        <input type="text" name="practicalName" value={selectedUser.practicalName} onChange={handleInputChange} />
                                    </div>

                                    <div className={style.inpBox}>
                                        <label htmlFor="practicalCode">Practical Code: </label>
                                        <input type="text" name="practicalCode" value={selectedUser.practicalCode} onChange={handleInputChange} />
                                    </div>
                                    <div className={style.inpBox}>
                                        <label htmlFor="practicalCredit">Practical credit: </label>
                                        <input type="text" name="practicalCredit" value={selectedUser.practicalCredit} onChange={handleInputChange} />
                                    </div>

                                    <div className={style.flexBox}>
                                        <div className={style.inpBox}>
                                            <label htmlFor="practicalMax">Practical Max:</label>
                                            <input type="number" name="practicalMax" value={selectedUser.practicalMax || ''} onChange={handleInputChange} placeholder="Practical name" />
                                        </div>
                                        <div className={style.inpBox}>
                                            <label htmlFor="practicalMin">Practical Min:</label>
                                            <input type="number" name="practicalMin" value={selectedUser.practicalMin || ''} onChange={handleInputChange} placeholder="Practical name" />
                                        </div>
                                    </div>

                                </>
                            )}

                            <div className={style.inpBox}>
                                <label htmlFor="sem">Sem no: </label>
                                <select name="sem" id="semEdit" value={selectedUser.sem} onChange={handleInputChange}>
                                    <option value="1">Sem 1</option>
                                    <option value="2">Sem 2</option>
                                    <option value="3">Sem 3</option>
                                    <option value="4">Sem 4</option>
                                    {/* Add more semesters as needed */}
                                </select>
                            </div>

                            <div className={style.inpBox}>
                                <label htmlFor="stream">Department: </label>
                                <select name="stream" id="streamEdit" value={selectedUser?.stream?._id} onChange={handleInputChange}>
                                    {departmentData && departmentData.department.length > 0 ? (
                                        departmentData.department.map((data) => (
                                            <option value={data._id} key={data._id}>
                                                {data.stream}
                                            </option>
                                        ))
                                    ) : (
                                        <option disabled>No data available</option>
                                    )}
                                </select>
                            </div>
                        </div>

                        <div className={style.btnContainer}>
                            <div className={style.inpBox}>
                                <button className={style.updateBtn} disabled={updateSubjectMutation.isPending} type='submit' onClick={(e) => handleUpdate(selectedUser, e)}>{updateSubjectMutation.isPending ? "Updating.." : "Update"}</button>
                            </div>

                            <div className={style.inpBox}>
                                <button className={style.deleteBtn} disabled={deleteSubjectMutation.isPending} onClick={(e) => handleDelete(selectedUser, e)}>{deleteSubjectMutation.isPending ? "Deleting.." : "Delete"}</button>
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
