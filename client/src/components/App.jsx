import React from 'react';
import Calendar from './Calendar.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      listing_id: 0,
    };
  }

  componentDidMount() {
    // get a random listing and pass it down to Calendar
  }

  render() {
    return (
      <div>
        <h4>Reservations</h4>
        <Calendar />
      </div>
    );
  }
}

export default App;