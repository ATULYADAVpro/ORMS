import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import style from './subjectList.module.css';
import { getAllSubject, getDepartment } from '../../../api/api';

export default function SubjectsList() {
    const TABLE_ROW = ["Subject Code", "Subject Name", "Practical Code", "Practical Name", "Stream", "Action"];

    const [stream, setStream] = useState('All');
    const [sem, setSem] = useState('All');
    const [search, setSearch] = useState('');
    const [filteredSubjects, setFilteredSubjects] = useState([]);

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

    useEffect(() => {
        if (subjectData) {
            let filtered = subjectData.result;
            console.log(filtered)

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
                                    <td>{data.practicalCode}</td>
                                    <td>{data.practicalName}</td>
                                    <td>{data.stream.stream}</td>
                                    <td>
                                        <button className={style.btnEdit}>Edit</button>
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
        </div>
    );
}
