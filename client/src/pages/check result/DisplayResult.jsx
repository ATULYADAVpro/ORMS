import { useEffect, useState } from 'react';
import { displayResultData, getDepartment } from '../../api/api';
import MonthYearPicker from '../../common/MonthYearPicker';
import style from './style.module.css';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import CommonPrintLayout from './CommonPrintLayout';

export default function DisplayResult() {
    const [monthYear, setMonthYear] = useState(null);
    const [sem, setSem] = useState(null);
    const [rollNo, setRollNo] = useState(null);
    const handleMonthYearChange = (monthYear) => setMonthYear(monthYear);
    const [resultData, setResultData] = useState({});

    const { mutate: displayResultMutate } = useMutation({
        mutationFn: displayResultData,
        mutationKey: ["resultData"],
        onSuccess: (data) => {
            toast.success("Success");
            setResultData(data);
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    function handleSubmit() {
        if (!monthYear || !sem || !rollNo) {
            toast.error("All fields are required.");
        } else {
            displayResultMutate({ date_of_issue: monthYear, sem, rollNo: rollNo.toLowerCase() });
        }
    }

    useEffect(() => {
        console.log(resultData);
    }, [resultData]);

    return (
        <>
            {Object.keys(resultData).length > 0 ? (
                <CommonPrintLayout data={resultData} />
            ) : (
                <div className={style.container}>
                    <div className={style.formContainer}>
                        <div className={style.logo}>
                            <img src="/logo2.png" alt="" />
                        </div>

                        <h3>Check Result</h3>
                        <hr />
                        <br />
                        <select name="sem" id="sem" defaultValue={""} onChange={(e) => setSem(e.target.value)}>
                            <option value="" disabled>Select Semester</option>
                            <option value="1">Semester 1</option>
                            <option value="2">Semester 2</option>
                            <option value="3">Semester 3</option>
                            <option value="4">Semester 4</option>
                        </select>

                        <input type="text" name='rollNo' id='rollNo' placeholder='Roll No' onChange={(e) => setRollNo(e.target.value)} />

                        <div className={style.MonthYearPicker}>
                            <MonthYearPicker handleMonthYearChange={handleMonthYearChange} />
                            <p style={{ marginLeft: "1rem" }}>Please select the correct month & year</p>
                        </div>

                        <div className={style.btnConatiner}>
                            <button onClick={handleSubmit}>Submit</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
