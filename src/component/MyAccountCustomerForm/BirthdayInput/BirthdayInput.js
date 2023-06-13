import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { isArabic } from "Util/App";

import "react-datepicker/dist/react-datepicker.css";
import "./BirthdayInput.style.scss";

export default function BirthDayInput({ setDateOfBirth, dob }) {
  const [birthdaySelected, setBirthdaySelected] = useState(
    dob ? new Date(dob) : null
  );
  const [daySelected, setDaySelected] = useState(null);
  const [monthSelected, setMonthSelected] = useState(null);
  const [yearSelected, setYearSelected] = useState(null);
  const startYear = 1930;
  const endYear = new Date().getFullYear();
  const isArabicValue = isArabic();
  var years = yearsRange();
  function yearsRange() {
    let yearsArray = [];
    for (let year = startYear; year <= endYear; year++) {
      yearsArray.push(year);
    }
    return yearsArray;
  }
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    if (yearSelected && monthSelected && daySelected) {
      setDateOfBirth(`${yearSelected}-${monthSelected}-${daySelected}`);
    }
  }, [birthdaySelected]);

  return (
    <div
      className={
        isArabicValue ? "BirthdayInput BirthdayInputArabic" : "BirthdayInput"
      }
    >
      <DatePicker
        renderCustomHeader={({
          date,
          changeYear,
          changeMonth,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
        }) => (
          <div
            style={{
              margin: 10,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
              {"<"}
            </button>
            <select
              value={date.getFullYear()}
              onChange={({ target: { value } }) => {
                changeYear(value);
              }}
            >
              {years.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <select
              value={months[date.getMonth()]}
              onChange={({ target: { value } }) =>
                changeMonth(months.indexOf(value))
              }
            >
              {months.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
              {">"}
            </button>
          </div>
        )}
        selected={birthdaySelected}
        onChange={(date) => {
          setDaySelected(date?.getDate());
          setMonthSelected(date?.getMonth() + 1);
          setYearSelected(date?.getFullYear());
          setBirthdaySelected(date);
        }}
        placeholderText={__("YOUR BIRTHDAY")}
        maxDate={new Date()}
        dateFormat="dd-MM-yyyy"
        disabled={dob}
        onKeyDown={(e) => {
          e.preventDefault();
        }}
      />
    </div>
  );
}
