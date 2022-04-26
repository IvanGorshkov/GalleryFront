import React, { useState } from 'react';
import moment from "moment"
import TextField from "@material-ui/core/TextField";
import {
  LocalizationProvider, MobileDateRangePicker, StaticDateRangePicker
} from '@material-ui/pickers';
import DateFnsUtils from "@material-ui/pickers/adapter/date-fns";
import Box from '@mui/material/Box';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';
import { ru } from 'react-date-range/dist/locale'; // theme css file

export default function CalendarsDateRangePicker() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  let selectionRange ={
    startDate: startDate,
    endDate: endDate,
    key: 'selection',
  }

  console.log(selectionRange);
  function handleSelect(ranges){
    setStartDate(ranges.selection.startDate);
    setEndDate(ranges.selection.endDate);
  }

  return (
      <DateRangePicker
        locale={ru}
        ranges={[selectionRange]}
        onChange={handleSelect}
      />
  );
}