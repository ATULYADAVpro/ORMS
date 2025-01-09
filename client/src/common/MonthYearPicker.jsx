import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import style from './mandy.module.css'

const MonthYearPicker = ({ handleMonthYearChange }) => {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (date) {
      const formattedDate = date.toLocaleString("default", { month: "long", year: "numeric" });
      handleMonthYearChange(formattedDate); // Pass formatted date to parent
    } else {
      handleMonthYearChange(null); // Pass null if the selection is cleared
    }
  };

  return (
    <div>
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        showMonthYearPicker // Enable month and year picker mode
        dateFormat="MMMM yyyy" // Format to display as Month Year in the UI
        placeholderText="Semester Year"
        className={style.input}
      />
    </div>
  );
};

export default MonthYearPicker;
