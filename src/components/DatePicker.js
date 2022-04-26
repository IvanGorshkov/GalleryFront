import React, { useState } from 'react';
import moment from "moment"
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';
import { ru } from 'react-date-range/dist/locale'; // theme css file

export default function CalendarsDateRangePicker(props) {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  let selectionRange ={
    startDate: startDate,
    endDate: endDate,
    key: 'selection',
  }
  const updatePendingValue = (newValue) => {
    newValue.forEach((element, index) => {
      if (newValue[index] != null) {
        newValue[index] = moment(element).format('yyyy-MM-DD');
      }
    });
    setValue(newValue);
  };

  console.log(selectionRange);
  function handleSelect(ranges){
    setStartDate(ranges.selection.startDate);
    setEndDate(ranges.selection.endDate);
    props.onChange(
      moment(ranges.selection.startDate).format('yyyy-MM-DD'),
      moment(ranges.selection.endDate).format('yyyy-MM-DD'),
      )
  }

  return (
      <DateRangePicker
        locale={ru}
        ranges={[selectionRange]}
        onChange={handleSelect}
      />
  );
}