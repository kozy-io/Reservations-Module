import React from 'react';
import styles from '../styles/calendar.css';
import Date from './Date.jsx';

class Month extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    const { startingDay, daysInMonth, handleSelect, getStatus } = this.props;

    const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const header = days.map((day) => {
      return (
        <th key={day} className={styles.weekNames}>{day}</th>
      );
    });

    const filler = [];
    for (let i = 0; i < startingDay; i += 1) {
      filler.push(
        <td key={`${i}-null`} className={styles.fillerDays}>{null}</td>,
      );
    }

    const existingDays = [];
    for (let j = 1; j <= daysInMonth; j += 1) {
      let status = getStatus(j);
      existingDays.push(<Date key={startingDay + j} status={'weekDays' + status + 'Normal'} number={j} handleSelect={handleSelect} />);
    }

    const totalElements = filler.concat(existingDays);
    const fullRows = [];
    let elements = [];
    for (let k = 0; k < totalElements.length; k += 1) {
      if (k % 7 === 0) {
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
      <table className={styles.calendarTable}>
        <tbody>
          <tr>
            {header}
          </tr>
        {calendarDays}
        </tbody>
      </table>
    );
  }
}

export default Month;
