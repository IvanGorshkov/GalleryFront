import React, { useState } from 'react';
import moment from "moment"
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';
import { ru } from 'react-date-range/dist/locale';
import { createStaticRanges } from 'react-date-range/dist/defaultRanges';
import {
  addDays,
  endOfDay,
  startOfDay,
  startOfMonth,
  endOfMonth,
  addMonths,
  startOfWeek,
  endOfWeek,
  isSameDay,
  differenceInCalendarDays,
} from 'date-fns';

const defineds = {
  startOfWeek: startOfWeek(new Date()),
  endOfWeek: endOfWeek(new Date()),
  startOfLastWeek: startOfWeek(addDays(new Date(), -7)),
  endOfLastWeek: endOfWeek(addDays(new Date(), -7)),
  startOfToday: startOfDay(new Date()),
  endOfToday: endOfDay(new Date()),
  startOfYesterday: startOfDay(addDays(new Date(), -1)),
  endOfYesterday: endOfDay(addDays(new Date(), -1)),
  startOfMonth: startOfMonth(new Date()),
  endOfMonth: endOfMonth(new Date()),
  startOfLastMonth: startOfMonth(addMonths(new Date(), -1)),
  endOfLastMonth: endOfMonth(addMonths(new Date(), -1)),
  endOf3Month: endOfMonth(addMonths(new Date(), +3)),
  endOf6Month: endOfMonth(addMonths(new Date(), +6)),
};

export default function CalendarsDateRangePicker(props) {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  let selectionRange ={
    startDate: startDate,
    endDate: endDate,
    key: 'selection',
  }

  function handleSelect(ranges){
    setStartDate(ranges.selection.startDate);
    setEndDate(ranges.selection.endDate);
    props.onChange(
      moment(ranges.selection.startDate).format('yyyy-MM-DD'),
      moment(ranges.selection.endDate).format('yyyy-MM-DD'),
      )
  }
  const defaultInputRanges = [
    {
      label: 'дней до сегодняшнего дня',
      range(value) {
        return {
          startDate: addDays(defineds.startOfToday, (Math.max(Number(value), 1) - 1) * -1),
          endDate: defineds.endOfToday,
        };
      },
      getCurrentValue(range) {
        if (!isSameDay(range.endDate, defineds.endOfToday)) return '-';
        if (!range.startDate) return '∞';
        return differenceInCalendarDays(defineds.endOfToday, range.startDate) + 1;
      },
    },
    {
      label: 'дней начиная с сегодняшнего дня',
      range(value) {
        const today = new Date();
        return {
          startDate: today,
          endDate: addDays(today, Math.max(Number(value), 1) - 1),
        };
      },
      getCurrentValue(range) {
        if (!isSameDay(range.startDate, defineds.startOfToday)) return '-';
        if (!range.endDate) return '∞';
        return differenceInCalendarDays(range.endDate, defineds.startOfToday) + 1;
      },
    },
  ];

  const sideBarOptions = () => {
    const customDateObjects = [
      {
        label: 'Неделю',
        range: () => ({
          startDate: defineds.startOfToday,
          endDate: defineds.endOfWeek
        })
      },
      {
        label: 'Месяц',
        range: () => ({
          startDate: defineds.startOfToday,
          endDate: defineds.endOfMonth
        })
      },
      {
        label: '3 Месяца',
        range: () => ({
          startDate: defineds.startOfToday,
          endDate: defineds.endOf3Month
        })
      },
      {
        label: '6 Месяцев',
        range: () => ({
          startDate: defineds.startOfToday,
          endDate: defineds.endOf6Month
        })
      },
      {
        label: 'Год',
        range: () => ({
          startDate: defineds.startOfToday,
          endDate: defineds.endOfYear
        })
      },
    ];

    return customDateObjects;
  };

  const sideBar = sideBarOptions();

  const staticRanges = [
    // ...defaultStaticRanges,
    ...createStaticRanges(sideBar)
  ];

  return (
      <DateRangePicker
        staticRanges={staticRanges}
        inputRanges={defaultInputRanges}
        locale={ru}
        ranges={[selectionRange]}
        onChange={handleSelect}
        scroll={{enabled: true}}
      />
  );
}

