import React, { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { getActiveSemester } from '../../../../api/api';

export default function CommonPrintLayout({ data }) {
    const [semData, setSemData] = useState([]);

    // React Query Mutation to fetch semester data
    const { mutate: studentSemDataMutate } = useMutation({
        mutationFn: getActiveSemester,
        onSuccess: (data) => {
            toast.success('Successful');
            setSemData(data);
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    useEffect(() => {
        if (data && data.student && data.student.semesters) {
            studentSemDataMutate(data.student.semesters);
        }
    }, [data, studentSemDataMutate]);

    // ... rest of your CommonPrintLayout component



    const renderSubjectRow = (sub, i) => (
        <tr key={i}>
            <td>{sub.subjectCode}</td>
            <td>{sub.subjectName}</td>
            <td>{sub?.internalMax}</td>
            <td>{sub?.internalMin}</td>
            <td>{sub.internal}</td>
            <td>{sub?.externalMax}</td>
            <td>{sub?.externalMin}</td>
            <td>{sub.external}</td>
            <td>{sub?.totalMax}</td>
            <td>{sub?.totalMin}</td>
            <td>{sub.totalMark}</td>
            <td>{sub.grade}</td>
            <td>{sub.gradePoint}</td>
            <td>{sub.credit}</td>
            <td>{sub.CPA}</td>
            {i === 0 && (
                <td rowSpan={data.subjects.length + (data.stream.practical ? data.subjects.length : 0)}>
                    {data.success === false ? "Fail" : data.sgpa}
                </td>
            )}
        </tr>
    );

    const renderPracticalRow = (sub, i) => (
        <tr key={`practical-${i}`}>
            <td>{sub.practicalCode}</td>
            <td>{sub.practicalName}</td>
            <td></td>
            <td></td>
            <td>-</td>
            <td></td>
            <td></td>
            <td>{sub.practicalMark}</td>
            <td>{sub.practicalMax}</td>
            <td>{sub.practicalMin}</td>
            <td>{sub.practicalMark}</td>
            <td>{sub.practicalGrade}</td>
            <td>{sub.practicalGradePoint}</td>
            <td>{sub.practicalCredit}</td>
            <td>{sub.practicalCPA}</td>
        </tr>
    );

    const creditEarnSemWaise = {
        sem1: "",
        sem2: "",
        sem3: "",
        sem4: "",
    };

    semData.forEach((data) => {
        if (data.sem === "1") {
            creditEarnSemWaise.sem1 = data.credit;
        }
        if (data.sem === "2") {
            creditEarnSemWaise.sem2 = data.credit;
        }
        if (data.sem === "3") {
            creditEarnSemWaise.sem3 = data.credit;
        }
        if (data.sem === "4") {
            creditEarnSemWaise.sem4 = data.credit;
        }
    });

    return (
        <div className="printLayoutForExport">
            <table>
                <thead>
                    <tr>
                        <th>Programe</th>
                        <th>Roll No</th>
                        <th>PRN/Reg.No.</th>
                        <th>Name of the Candidate</th>
                        <th>Month & Year of Examination</th>
                        <th>Semester</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{data.stream.stream}</td>
                        <td>{data.student.rollNo}</td>
                        <td>{data.student.prn}</td>
                        <td>{`${data.student.lastName} ${data.student.firstName} ${data.student.fatherName} ${data.student.motherName}`}</td>
                        <td>{data.date_of_issue}</td>
                        <td> sem {data.date_of_issue}</td>
                    </tr>
                </tbody>
            </table>

            {/* result data */}
            <table style={{ width: "100%" }}>
                <thead>
                    <tr>
                        <th rowSpan={"2"}>Code</th>
                        <th rowSpan={"2"}>Name</th>
                        <th colSpan={"3"}>Internal</th>
                        <th colSpan={"3"}>External</th>
                        <th colSpan={"3"}>Total</th>
                        <th rowSpan={"2"}>Grade</th>
                        <th rowSpan={"2"}>Grade Points</th>
                        <th rowSpan={"2"}>Credit Points</th>
                        <th rowSpan={"2"}>CxG</th>
                        <th rowSpan={data.subjects.length + (data.stream.practical ? data.subjects.length : 0)}>SGPI</th>
                    </tr>
                    <tr>
                        <th>Max</th>
                        <th>Min</th>
                        <th>Obt</th>
                        <th>Max</th>
                        <th>Min</th>
                        <th>Obt</th>
                        <th>Max</th>
                        <th>Min</th>
                        <th>Obt</th>
                    </tr>
                </thead>
                <tbody>
                    {data && data.subjects.map((sub, i) => renderSubjectRow(sub, i))}
                    {data.stream.practical && data.subjects.map((sub, i) => renderPracticalRow(sub, i))}
                </tbody>
            </table>
            <table>
                <thead>
                    <tr>
                        <th>Remark: {data.success ? "Successful" : "Fail"}</th>
                        <th>Credit Earned: {data.credit}</th>
                        <th>Total Credit: {data.credit}</th>
                        <th>C*G: {data.score}</th>
                        <th>SGPI: {data.success === false ? "Fail" : data.sgpa}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Credit Earned sem 1: {creditEarnSemWaise.sem1}</td>
                        <td>Credit Earned sem 2: {creditEarnSemWaise.sem2}</td>
                        <td>Credit Earned sem 3: {creditEarnSemWaise.sem3}</td>
                        <td>Credit Earned sem 4: {creditEarnSemWaise.sem4}</td>
                        <td>Grade: {data.success === false ? "Fail" : data.grade}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}