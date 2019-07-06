import React from 'react';
import axios from 'axios';

class Calendar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      initialMonth: new Date().getMonth(),
      initialYear: new Date().getFullYear(),
      currentMonth: new Date().getMonth(),
      currentYear: new Date().getFullYear(),
      selectCheckIn: 0,
      selectCheckOut: 0,
      reserved: [],
    };

    this.getStartingDay = this.getStartingDay.bind(this);
    this.getDaysInMonth = this.getDaysInMonth.bind(this);
    this.handleMonthChange = this.handleMonthChange.bind(this);
  }

  getStartingDay() {
    // will return an index corresponding to the day of the week (0 represents Sunday)
    const { currentMonth, currentYear } = this.state;
    const startDay = new Date(currentYear, currentMonth, 1).getDay();
    return startDay;
  }

  getDaysInMonth() {
    const { currentMonth, currentYear } = this.state;
    return new Date(currentYear, currentMonth + 1, 0).getDate();
  }

  // eslint-disable-next-line react/sort-comp
  handleMonthChange(event) {
    event.preventDefault();
    const { name } = event.target;
    const { currentMonth, currentYear } = this.state;

    if (name === 'right') {
      const newMonth = (currentMonth + 1) % 12;
      const newYear = (newMonth === 0 ? currentYear + 1 : currentYear );

      this.setState({
        currentMonth: newMonth,
        currentYear: newYear,
      });
    } else {
      const newMonth = ( currentMonth + 11 ) % 12;
      const newYear = ( newMonth === 11 ? currentYear - 1 : currentYear );

      this.setState({
        currentMonth: newMonth,
        currentYear: newYear,
      });
    }
  }

  getMonth() {
    const { currentMonth } = this.state;
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
      'September', 'October', 'November', 'December'];
    return months[currentMonth];
  }

  render() {
    // eslint-disable-next-line react/destructuring-assignment
    
    const month = this.getMonth();
    const { currentYear, reserved } = this.state;

    const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const daysOfTheWeek = days.map((day) => {
      return (
        <th key={day} className="week-names">{day}</th>
      );
    });

    const filler = [];
    for (let i = 0; i < this.getStartingDay(); i += 1) {
      filler.push(
        <td key={`${i}-null`} className="week-days">{null}</td>,
      );
    }

    const existingDays = [];
    const daysInMonth = this.getDaysInMonth();
    for (let j = 1; j <= daysInMonth; j += 1) {
      existingDays.push(
        <td key={j}>{j}</td>,
      );
    }

    const totalElements = filler.concat(existingDays);  // concat all row data into one array
    // loop through all the row data and break it down into <tr> rows that will be displayed
    const fullRows = [];
    let elements = [];
    for (let k = 0; k < totalElements.length; k += 1) {
      if (k % 7 === 0) {  // if a full row has been reached (7 days)
        fullRows.push(elements);
        elements = [];
        elements.push(totalElements[k]);
      } else {
        elements.push(totalElements[k]);
      }
      if (k >= totalElements.length - 1) {
        fullRows.push(elements);
      }
    }

    const calendarDays = fullRows.map((row, i) => {
      return (
        // eslint-disable-next-line react/no-array-index-key
        <tr key={`${i}-row`}>{row}</tr>
      );
    });

    return (
      <div>
        <div className="calendar-header">
          <button name="left" onClick={(event) => {this.handleMonthChange(event)}}>Left</button>
          <b>{`${month} ${currentYear}`}</b>
          <button name="right" onClick={(event) => {this.handleMonthChange(event)}}>Right</button>
        </div>
        <table>
          <tbody>
            <tr>
              {daysOfTheWeek}
            </tr>
            {calendarDays}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Calendar;
