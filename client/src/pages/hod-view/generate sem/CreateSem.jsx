import React, { useState } from 'react';
import style from './createSem.module.css';
import YearPicker from '../../../common/YearPicker';
import MonthYearPicker from '../../../common/MonthYearPicker';

export default function CreateSem() {
    // State variables for selections
    const [selectedSem, setSelectedSem] = useState('');
    const [selectedExamType, setSelectedExamType] = useState('');
    const [monthYear, setMonthYear] = useState(null);
    const [tableData, setTableData] = useState([]);
    const [selectAll, setSelectAll] = useState(false); // Track select all checkbox state

    // Handle Select changes
    const handleSemChange = (e) => setSelectedSem(e.target.value);
    const handleExamTypeChange = (e) => setSelectedExamType(e.target.value);

    // State for year selection
    const [year, setYear] = useState(null);

    // Handle Year change
    const handleYearChange = (selectedYear) => {
        setYear(selectedYear); // Update year state when selected
    };
    const handleMonthYearChange = (monthYear) => setMonthYear(monthYear);
    console.log(monthYear)

    // Handle Generate button click
    const handleGenerate = () => {

    };

    // Handle select all checkbox change
    const handleSelectAllChange = (e) => {
        setSelectAll(e.target.checked);
        const updatedData = tableData.map(item => ({ ...item, selected: e.target.checked }));
        setTableData(updatedData);
    };

    // Handle individual row checkbox change
    const handleRowCheckboxChange = (index) => {
        const updatedData = [...tableData];
        updatedData[index].selected = !updatedData[index].selected;
        setTableData(updatedData);
    };

    return (
        <div>
            <div className={style.NavContainer}>
                <div className={style.Nav}>
                    <select name="sem" id="sem" defaultValue={""} onChange={handleSemChange}>
                        <option value="" disabled>Select Sem</option>
                        <option value="sem1">Semester 1</option>
                        <option value="sem2">Semester 2</option>
                        {/* Add more options as needed */}
                    </select>

                    <select name="examType" id="examType" defaultValue={""} onChange={handleExamTypeChange}>
                        <option value="" disabled>Select Exam Type</option>
                        <option value="midterm">Midterm</option>
                        <option value="final">Final</option>
                        {/* Add more options as needed */}
                    </select>

                    <div className={style.YearPicker}>
                        <YearPicker handleYearChange={handleYearChange} />
                    </div>

                    <div className={style.MonthYearPicker}>
                        <MonthYearPicker handleMonthYearChange={handleMonthYearChange} />
                    </div>
                </div>

                <div className={style.btnSubmit}>
                    <button onClick={handleGenerate}>Generate</button>
                </div>
            </div>

            <div className={style.mainData}>
                <table>
                    <thead>
                        <tr>
                            <th className={style.Select} style={{ display: "flex", width: '100%' }} >
                                <input
                                    type="checkbox"
                                    checked={selectAll}
                                    onChange={handleSelectAllChange}

                                />
                                <p>select</p>
                            </th>
                            <th className={style.Select}>Roll No</th>
                            <th>Name</th>
                            <th>Addmission Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map((data, index) => (
                            <tr key={data.id}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={data.selected}
                                        onChange={() => handleRowCheckboxChange(index)}
                                    />
                                </td>
                                <td>{data.rollNo}</td>
                                <td>{data.name}</td>
                                <td>{data.admissionDate}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
