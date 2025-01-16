import React from 'react';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { Table, TableHeader, TableCell, TableBody, DataTableCell } from '@react-pdf-table/react-pdf-table';

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  table: {
    marginBottom: 10,
  },
});

const PdfDocument = ({ data, semData }) => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.title}>Semester Data</Text>

      <View style={styles.table}>
        <Table data={data.subjects}>
          <TableHeader>
            <TableCell>Code</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Internal Max</TableCell>
            <TableCell>Internal Min</TableCell>
            <TableCell>Internal Obt</TableCell>
            <TableCell>External Max</TableCell>
            <TableCell>External Min</TableCell>
            <TableCell>External Obt</TableCell>
            <TableCell>Total Max</TableCell>
            <TableCell>Total Min</TableCell>
            <TableCell>Total Obt</TableCell>
            <TableCell>Grade</TableCell>
            <TableCell>Grade Points</TableCell>
            <TableCell>Credit Points</TableCell>
            <TableCell>CxG</TableCell>
            <TableCell>SGPI</TableCell>
          </TableHeader>
          <TableBody>
            {data.subjects.map((sub, i) => (
              <DataTableCell key={i}>{sub.subjectCode}</DataTableCell>,
              <DataTableCell>{sub.subjectName}</DataTableCell>,
              <DataTableCell>{sub.internalMax}</DataTableCell>,
              <DataTableCell>{sub.internalMin}</DataTableCell>,
              <DataTableCell>{sub.internal}</DataTableCell>,
              <DataTableCell>{sub.externalMax}</DataTableCell>,
              <DataTableCell>{sub.externalMin}</DataTableCell>,
              <DataTableCell>{sub.external}</DataTableCell>,
              <DataTableCell>{sub.totalMax}</DataTableCell>,
              <DataTableCell>{sub.totalMin}</DataTableCell>,
              <DataTableCell>{sub.totalMark}</DataTableCell>,
              <DataTableCell>{sub.grade}</DataTableCell>,
              <DataTableCell>{sub.gradePoint}</DataTableCell>,
              <DataTableCell>{sub.credit}</DataTableCell>,
              <DataTableCell>{sub.CPA}</DataTableCell>,
              {i === 0 && <DataTableCell rowSpan={data.subjects.length + (data.stream.practical ? data.subjects.length : 0)}>{data.success === false ? "Fail" : data.sgpa}</DataTableCell>}
            ))}
          </TableBody>
        </Table>
      </View>

      {/* Add additional tables and data as needed */}
    </Page>
  </Document>
);

export default function DownloadButton({ data, semData }) {
  return (
    <div>
      <PDFDownloadLink document={<PdfDocument data={data} semData={semData} />} fileName="semister_data.pdf">
        {({ loading }) => (loading ? 'Loading document...' : 'Download now!')}
      </PDFDownloadLink>
    </div>
  );
}




import style from './semisterDataForSD.module.css';
import React from 'react';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { Table, TableHeader, TableCell, TableBody } from '@ag-media/react-pdf-table';

// Styles for the PDF document
const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  table: {
    marginBottom: 10,
  },
});

// PdfDocument component
const PdfDocument = ({ data }) => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.title}>Semester Data</Text>
      <View style={styles.table}>
        <Table>
          <TableHeader>
            <TableCell>Code</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Internal Max</TableCell>
            <TableCell>Internal Min</TableCell>
            <TableCell>Internal Obt</TableCell>
            <TableCell>External Max</TableCell>
            <TableCell>External Min</TableCell>
            <TableCell>External Obt</TableCell>
            <TableCell>Total Max</TableCell>
            <TableCell>Total Min</TableCell>
            <TableCell>Total Obt</TableCell>
            <TableCell>Grade</TableCell>
            <TableCell>Grade Points</TableCell>
            <TableCell>Credit Points</TableCell>
            <TableCell>CxG</TableCell>
            <TableCell>SGPI</TableCell>
          </TableHeader>
          <TableBody>
            {data.subjects.map((sub, i) => (
              <tr key={i}>
                <TableCell>{sub.subjectCode}</TableCell>
                <TableCell>{sub.subjectName}</TableCell>
                <TableCell>{sub.internalMax}</TableCell>
                <TableCell>{sub.internalMin}</TableCell>
                <TableCell>{sub.internal}</TableCell>
                <TableCell>{sub.externalMax}</TableCell>
                <TableCell>{sub.externalMin}</TableCell>
                <TableCell>{sub.external}</TableCell>
                <TableCell>{sub.totalMax}</TableCell>
                <TableCell>{sub.totalMin}</TableCell>
                <TableCell>{sub.totalMark}</TableCell>
                <TableCell>{sub.grade}</TableCell>
                <TableCell>{sub.gradePoint}</TableCell>
                <TableCell>{sub.credit}</TableCell>
                <TableCell>{sub.CPA}</TableCell>
                {i === 0 && (
                  <TableCell rowSpan={data.subjects.length + (data.stream.practical ? data.subjects.length : 0)}>
                    {data.success === false ? "Fail" : data.sgpa}
                  </TableCell>
                )}
              </tr>
            ))}
          </TableBody>
        </Table>
      </View>
      {/* Add additional tables and data as needed */}
    </Page>
  </Document>
);

export default function SemisterDataForSD({ data, semData }) {
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
      {i === 0 && <td rowSpan={data.subjects.length + (data.stream.practical ? data.subjects.length : 0)}>{data.success === false ? "Fail" : data.sgpa}</td>}
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

  console.log(creditEarnSemWaise);

  return (
    <div>
      <br />
      <hr />
      <div className={style.header}>
        <div>
          <h3 style={{ display: "inline-flex", marginLeft: "5px", fontWeight: "bold" }}>Sem No: {data.sem}</h3>
          <h3 style={{ display: "inline-flex", marginLeft: "2rem" }}>Type: {data.examType}</h3>
          <h3 style={{ display: "inline-flex", marginLeft: "2rem" }}>Exam date: {data.date_of_issue}</h3>
        </div>
        <div>
          <button className={style.btnPrint}>
            <PDFDownloadLink document={<PdfDocument data={data} semData={semData} />} fileName="semister_data.pdf">
              {({ loading }) => (loading ? 'Loading document...' : 'Download now!')}
            </PDFDownloadLink>
          </button>
        </div>
      </div>
      <hr />
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
            <th>Remark: {data.success === true ? "Successful" : "fail"}</th>
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


















@media print {
  .btnPrint {
      display: none;
  }

  table {
      width: 90%;
      border-collapse: collapse;
  }

  tbody>tr>td {
      border: 1px solid #000;
      /* padding: 2px; */
      text-align: left;
      font-size: small;
      font-weight: bold;
  }

  /* th {
      border: 1px solid #000;
      padding: 8px;
      text-align: left;
      font-size: xx-small;
  } */

  thead>tr>th {
      border: 1px solid #000;
      /* padding: 2px; */
      text-align: left;
      font-size: small;
  }

  html,
  body {
      height: 100vh;
      /* Use 100% here to support printing more than a single page*/
      margin: 0 !important;
      padding: 0 !important;
      overflow: hidden;
      align-items: center;
      justify-content: center;
  }

  @page {
      size: landscape;
      page-break-before: always;

  }

  .page_break {
      page-break-before: always;
      page-break-inside: avoid;
  }
  

  .printLayout {
      padding: 2rem;
      border: red solid 2px;
      width: 99%;
      margin: 5px;
      align-items: center;
      text-align: center;
      overflow-x: hidden;
      height: 98%;
      /* width: 90%; */
      display: flex;
      flex-direction: column;
      justify-content: center;
  }
}