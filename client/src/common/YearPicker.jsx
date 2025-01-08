import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const YearPicker = ({ handleYearChange }) => {
  const [selectedYear, setSelectedYear] = useState(null);

  return (
    <div>
      <DatePicker
        selected={selectedYear ? new Date(selectedYear, 0, 1) : null} // Display selected year
        onChange={(date) => {
          if (date) {
            const year = date.getFullYear(); // Extract the year
            setSelectedYear(year); // Update local state
            handleYearChange(year); // Pass selected year to parent component
          } else {
            setSelectedYear(null); // Handle case when input is cleared
            handleYearChange(null); // Pass null to parent if cleared
          }
        }}
        showYearPicker // Enable year picker mode
        dateFormat="yyyy" // Format to display only the year
        placeholderText="Select Year"
      />
    </div>
  );
};

export default YearPicker;
