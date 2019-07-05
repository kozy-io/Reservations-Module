import React from 'react';
import ReactDOM from 'react-dom';
import Calendar from './components/calendar.jsx';

class Reservations extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      
    };
  }

  render() {
    return (
      <div>
        <Calendar />
      </div>
    );
  }
}

ReactDOM.render(<Reservations />, document.getElementById('app'));
