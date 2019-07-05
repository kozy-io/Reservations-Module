import React from 'react';

class Calendar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentDate: new Date(),
    };

    this.getStartingDay = this.getStartingDay.bind(this);
  }

  getStartingDay() {
    const { currentDate } = this.state;
    const currMo = currentDate.getMonth();
    const currYe = currentDate.getFullYear();
    const startDay = new Date(currYe, currMo, 1).getDay();
    return startDay;
  }

  render() {
    const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    const filler = [];
    for (let i = 0; i < this.getStartingDay(); i += 1) {
      filler.push(
        <td className="week-days-empty">{null}</td>,
      );
    }

    return (
      <div>
        <h1>Calendar</h1>
        {
          days.map(day => <th key={day} className="week-days">{day}</th>)
        }
      </div>
    );
  }
}

export default Calendar;
