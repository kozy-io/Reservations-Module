/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/calendar.css';


const Date = (props) => {
  const { number, status, handleSelect } = props;
  return (
    <td
      className={styles[status]}
      onClick={(event, num) => { handleSelect(event, number); }}
    >
      {number}
    </td>
  );
};

Date.propTypes = {
  number: PropTypes.number.isRequired,
  status: PropTypes.oneOf(['weekDaysActiveNormal', 'weekDaysDisabledNormal', 'weekDaysBetweenNormal']).isRequired,
  handleSelect: PropTypes.func.isRequired,
};

export default Date;
