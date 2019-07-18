/* eslint-disable react/button-has-type */
import React from 'react';
import axios from 'axios';
import OutsideClickHandler from 'react-outside-click-handler';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import styles from '../styles/calendar.css';
import Month from './Month.jsx';

const moment = extendMoment(Moment);

class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initial: moment(),
      reserved: [],
      current: moment(),
      display: false,
      selectCheckIn: null,
      selectCheckOut: null,
      invalidCheckIn: null,
      invalidCheckOut: null,
    };

    this.handleReset = this.handleReset.bind(this);
    this.getReservedDates = this.getReservedDates.bind(this);
    this.handleMonthChange = this.handleMonthChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.getStatus = this.getStatus.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    this.getReservedDates();
  }

  getReservedDates() {
    const { current } = this.state;
    const {id} = this.props;
    const month = current.month();
    const year = current.year();

    axios.get(`/reserved/month?id=${id}&month=${month+1}&year=${year}`)
      .then(response => this.setState({
        reserved: response.data,
      }, () => {
        this.setState({
          display: true,
        });
      }))
      .catch((error) => { throw error });
  }

  getStatus(date) {
    const { reserved, current, selectCheckIn, selectCheckOut, invalidCheckIn, invalidCheckOut } = this.state;
    const { view, minStay } = this.props;
    const currentMonth = current.month();
    const currentYear = current.year();
    const fullDate = moment(`${currentYear}-${currentMonth + 1}-${date}`, 'YYYY-MM-DD');

    if (fullDate.isSame(selectCheckIn)) {
      return 'Between';
    }
    if (fullDate.isSame(selectCheckOut)) {
      return 'Between';
    }
    if (fullDate.isBefore()) {
      return 'Disabled';
    }
    if (invalidCheckIn || invalidCheckOut) {
      return 'Disabled';
    }
    if (view === 'in') {
      if (reserved.includes(date)) {
        return 'Disabled';
      }
    } else if (view === 'out') {
      if (reserved.includes(date - 1)) {
        return 'Disabled';
      }
    }
    if (fullDate.isBefore(selectCheckIn)) {
      return 'Disabled';
    }
    if (fullDate.isAfter(selectCheckOut)) {
      return 'Disabled';
    }
    if (selectCheckIn && !selectCheckOut) {
      const firstCheckOut = moment(selectCheckIn).clone().add(minStay, 'days').format('YYYY-MM-DD');

      if (fullDate.isBetween(selectCheckIn, firstCheckOut, null, '[)')) {
        return 'Disabled';
      }
    }
    if (selectCheckOut && !selectCheckIn) {
      const firstCheckIn = moment(selectCheckOut).clone().subtract(minStay, 'days').format('YYYY-MM-DD');
      // check if there is a reserved date between check in and check out
      if (fullDate.isBetween(firstCheckIn, selectCheckOut, null, '(]')) {
        return 'Disabled';
      }
    }
    if (!invalidCheckIn && !invalidCheckOut && selectCheckIn && selectCheckOut) {
      if (fullDate.isBetween(selectCheckIn, selectCheckOut, null, [])) {
        return 'Between';
      }
      return 'Disabled';
    }
    return 'Active';
  }

  handleSelect(event, date) {
    const { current } = this.state;
    const { view, getSelectedDates } = this.props;
    const currentMonth = current.month() + 1;
    const currentYear = current.year();
    const fullDate = moment(`${currentYear}-${currentMonth}-${date}`, 'YYYY-MM-DD');

    if (view === 'in') {
      this.setState({ selectCheckIn: fullDate }, () => {
        this.validateStay(fullDate, (date, status) => { getSelectedDates(date, status); });
      });
    } else {
      this.setState({ selectCheckOut: fullDate }, () => {
        this.validateStay(fullDate, (date, status) => { getSelectedDates(date, status); });
      });
    }
  }

  handleReset(event) {
    event.preventDefault();
    this.setState({
      current: moment(),
      selectCheckIn: null,
      selectCheckOut: null,
      invalidCheckIn: false,
      invalidCheckOut: false,
    }, () => {
      this.getReservedDates();
      this.props.clearSelectedDates();
    });
  }

  handleMonthChange(event, direction) {
    const { current } = this.state;

    if (direction === 'right') {
      const newCurrent = current.add(1, 'months');
      this.setState({ current: newCurrent }, () => {
        this.getReservedDates();
      });
    } else {
      const newCurrent = current.subtract(1, 'months');
      this.setState({ current: newCurrent }, () => {
        this.getReservedDates();
      });
    }
  }

  validateStay(fullDate, callback) {
    const {
      selectCheckIn, selectCheckOut, reserved, current, invalidCheckIn, invalidCheckOut,
    } = this.state;
    const { minStay, view } = this.props;
    const currentMonth = current.month();
    const currentYear = current.year();


    const fullReservedDates = reserved.map((day) => {
      const date = `${currentYear}-${currentMonth + 1}-${day}`;
      return moment(date, 'YYYY-MM-DD');
    });

    if (view === 'in') {
      const checkIn = selectCheckIn.format('YYYY-MM-DD');
      const validCheckOut = moment(checkIn).clone().add(minStay, 'days').format('YYYY-MM-DD');
      const range = moment.range(checkIn, moment(validCheckOut));
      for (let i = 0; i < fullReservedDates.length; i += 1) {
        if (range.contains(fullReservedDates[i], { excludeEnd: true })) {
          this.setState({ invalidCheckIn: true });
        }
      }
    }

    if (view === 'out') {
      const checkOut = selectCheckOut.format('YYYY-MM-DD');
      const validCheckIn = moment(checkOut).clone().subtract(minStay, 'days').format('YYYY-MM-DD');
      const range = moment.range(moment(validCheckIn), checkOut);
      for (let j = 0; j < fullReservedDates.length; j += 1) {
        if (range.contains(fullReservedDates[j], { excludeEnd: true })) {
          this.setState({ invalidCheckOut: true }, () => {
          });
        }
      }
    }

    if (!invalidCheckIn && !invalidCheckOut) {
      callback(fullDate, true);
    } else {
      callback(fullDate, false);
    }
  }

  handleClickOutside() {
    // eslint-disable-next-line react/prop-types
    const { hideCalendar } = this.props;
    document.getElementById('overlayCalendar').style.display = 'none';
    hideCalendar();
  }

  render() {
    const { current } = this.state;
    const allMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
      'September', 'October', 'November', 'December'];
    const { minStay } = this.props;
    const month = current.month();
    const year = current.year();
    const startingDay = current.weekday();
    const daysInMonth = current.daysInMonth();

    return (
      <div>
        <OutsideClickHandler
          onOutsideClick={() => { this.handleClickOutside(); }}
        >
          <div id={styles.overlayCalendar}>
          <svg role="presentation" focusable="false" className={styles.attachOuter}>
            <path className={styles.attachInnerFill} d="M0,10 20,10 10,0z" />
            <path className={styles.attachFill} d="M0,10 10,0 20,10" />
          </svg>

          <div className={styles.container}>
            <div className={styles.header}>

              <div id={styles.leftArrow}>
                <svg className={styles.svgLeftArrow} focusable="false" viewBox="0 0 1000 1000"
                  onClick={(event, direction) => {this.handleMonthChange(event, 'left'); }}
                >
                  <path d="M336 275L126 485h806c13
                    0 23 10 23 23s-10 23-23 23H126l210 210c11 11 11 21 0 32-5
                    5-10 7-16 7s-11-2-16-7L55 524c-11-11-11-21 0-32l249-249c21-22
                    53 10 32 32z"
                  />
                </svg>
              </div>

              <b>{allMonths[month]} {year}</b>
          
              <div id={styles.rightArrow}>
                <svg className={styles.svgRightArrow} focusable="false" viewBox="0 0 1000 1000"
                  onClick={(event, direction) => {this.handleMonthChange(event, 'right'); }}
                >
                  <path d="M694 242l249 250c12 11 12 21 
                    1 32L694 773c-5 5-10 7-16 7s-11-2-16-7c-11-11-11-21 0-32l210-210H68c-13
                    0-23-10-23-23s10-23 23-23h806L662 275c-21-22 11-54 32-33z" 
                  />
                </svg>
              </div>
            </div>

          
            <Month
              period={month}
              startingDay={startingDay}
              daysInMonth={daysInMonth}
              handleSelect={this.handleSelect}
              getStatus={this.getStatus}
            />
            
            <div className={styles.clearContainer}>
              <span className={styles.clearDisclaimer}>
                {minStay} night minimum stay.
              </span>
              <button name="clear" className={styles.clear} onClick={(event) => { this.handleReset(event); }}>
                Clear dates
              </button>
            </div>
          </div>
          </div>
        </OutsideClickHandler>
      </div>
    );
  }
}

export default Calendar;
