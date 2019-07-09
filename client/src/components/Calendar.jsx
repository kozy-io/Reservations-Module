import React from 'react';
import axios from 'axios';
import OutsideClickHandler from 'react-outside-click-handler';
import moment from 'moment';

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

    this.getReservedDates = this.getReservedDates.bind(this);
    this.getStatus = this.getStatus.bind(this);
    this.getStartingDay = this.getStartingDay.bind(this);
    this.getDaysInMonth = this.getDaysInMonth.bind(this);
    this.handleMonthChange = this.handleMonthChange.bind(this);
    this.clearDates = this.clearDates.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  componentDidMount() {
    this.getReservedDates();
  }

  handleClickOutside() {
    document.getElementById('overlay-calendar').style.display = 'none';
    this.props.hideCalendar();
  }

  getReservedDates() {
    const { currentMonth, currentYear } = this.state;
    axios.get(`/reserved/month?id=${this.props.id}&month=${currentMonth+1}&year=${currentYear}`)
      .then(response => this.setState({
        reserved: response.data,
      }))
      .catch((error) => { throw error });
  }

  getStatus(date) {
    const {
      currentMonth, currentYear, initialMonth, initialYear, reserved,
    } = this.state;

    const { view } = this.props;

    if (currentYear === initialYear) {
      if (currentMonth < initialMonth) {
        return 'week-days-disabled';
      }
    } else if (currentYear < initialYear) {
      return 'week-days-disabled';
    }

    if (view === 'in') {
      if (reserved.includes(date)) {
        return 'week-days-disabled';
      }
    } else if (view === 'out') {
      if (reserved.includes(date - 1)) {
        return 'week-days-disabled';
      }
    }
    return 'week-days-active';
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
  handleMonthChange(event, direction) {
    const { currentMonth, currentYear } = this.state;

    if (direction === 'right') {
      const newMonth = (currentMonth + 1) % 12;
      const newYear = (newMonth === 0 ? currentYear + 1 : currentYear );

      this.setState({
        currentMonth: newMonth,
        currentYear: newYear,
      }, () => {
        this.getReservedDates();
      });
    } else {
      const newMonth = ( currentMonth + 11 ) % 12;
      const newYear = ( newMonth === 11 ? currentYear - 1 : currentYear );

      this.setState({
        currentMonth: newMonth,
        currentYear: newYear,
      }, () => {
        this.getReservedDates();
      });
    }
  }

  clearDates(event) {
    event.preventDefault();
    const { initialMonth, initialYear } = this.state;
    this.setState({
      currentMonth: initialMonth,
      currentYear: initialYear,
      selectCheckIn: null,
      selectCheckOut: null,
    }, () => {
      this.getReservedDates();  // repopulate calendar with current reserved dates
      this.props.clearSelectedDates();
    });
  }

  handleSelect(event, date) {
    const { currentMonth, currentYear } = this.state;
    date = date + "";
    if (date.length === 1) {
      date = "0" + date;
    }

    let month = currentMonth + 1 + "";
    if (month.length === 1) {
      month = "0" + month;
    }
    const fullDate = `${currentYear}-${month}-${date}`;
    
    if (this.props.view === "in") {
      this.setState({
        selectCheckIn: fullDate,
      }, () => {
        this.props.getSelectedDates(fullDate);
      });
    } else {
      this.setState({
        selectCheckOut: fullDate,
      }, () => {
        this.props.getSelectedDates(fullDate);
      });
    }
    console.log(fullDate);
  }


  getMonth() {
    const { currentMonth } = this.state;
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
      'September', 'October', 'November', 'December'];
    return months[currentMonth];
  }

  render() {
    // eslint-disable-next-line react/destructuring-assignment
    const { selectCheckIn, selectCheckOut, currentMonth } = this.state;
    let selectedDates = [selectCheckIn].concat([selectCheckOut]);

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
      let dateFormat = currentYear + '-' + (currentMonth+1) + '-' + j;
      dateFormat = moment(dateFormat, 'YYYY-MM-DD');
      let clickDate = (dateFormat.format('YYYY-MM-DD'));

      existingDays.push(
        <td onClick={(event, date) => { this.handleSelect(event, j)}} key={j}
          className={`${this.getStatus(j)}${selectedDates.includes(clickDate) ? '-selected' : '-normal'}`}>{j}</td>,
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
      <OutsideClickHandler
      onOutsideClick={() => {
        this.handleClickOutside();
      }}>
        <div id="overlay-calendar">
          <div className="calendar-container">
          <div className="calendar-header">
            <div id="calendar-left-arrow">
            <svg className="svg-left-arrow" focusable="false" viewBox="0 0 1000 1000" 
              onClick={(event, direction) => {this.handleMonthChange(event, "left")}}>
                <path d="M336 275L126 485h806c13 
                0 23 10 23 23s-10 23-23 23H126l210 210c11 11 11 21 0 32-5 
                5-10 7-16 7s-11-2-16-7L55 524c-11-11-11-21 0-32l249-249c21-22 
                53 10 32 32z"></path></svg>
            </div>
            <b>{`${month} ${currentYear}`}</b>
            <div id="calendar-right-arrow">
            <svg className="svg-right-arrow" focusable="false" viewBox="0 0 1000 1000"
             onClick={(event, direction) => {this.handleMonthChange(event, "right")}}><path d="M694 242l249 250c12 11 12 21 
             1 32L694 773c-5 5-10 7-16 7s-11-2-16-7c-11-11-11-21 0-32l210-210H68c-13 0-23-10-23-23s10-23 
             23-23h806L662 275c-21-22 11-54 32-33z"></path></svg>
            </div></div>
          <table>
            <tbody>
              <tr>
                {daysOfTheWeek}
              </tr>
              {calendarDays}
            </tbody>
          </table>
          <button name="clear" onClick={(event) => {this.clearDates(event)}}>Clear</button>
        </div>
        </div>
        </OutsideClickHandler>
    );
  }
}

export default Calendar;
