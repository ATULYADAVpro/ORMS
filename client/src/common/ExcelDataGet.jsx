import React, { useState } from "react";
import * as XLSX from "xlsx";

const ExcelReader = ({ setExcelDatatoStd }) => {
    // const [excelData, setExcelData] = useState([]);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: "binary" });

            // Assume we're working with the first sheet
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            // Convert sheet to JSON
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            // setExcelData(jsonData);
            setExcelDatatoStd(jsonData)
        };

        reader.readAsBinaryString(file);
    };

    return (
        <div>
            <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} placeholder="upload excel data if have" />
            {/* <table border="1">
        <thead>
          <tr>
            {excelData[0] &&
              excelData[0].map((header, index) => <th key={index}>{header}</th>)}
          </tr>
        </thead>
        <tbody>
          {excelData.slice(1).map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table> */}
        </div>
    );
};

export default ExcelReader;
