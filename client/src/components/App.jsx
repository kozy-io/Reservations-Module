import React from 'react';
import axios from 'axios';

import Calendar from './Calendar.jsx';


class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      base_rate: 0,
      currency: 'USD',
      extra_guest_cap: 0,
      extra_guest_charge: 0,
      id: null,
      local_tax: 0.09,
      max_guests: 0,
      min_stay: 0,
      review_count: 0,
      star_rating: 0,
      selectedCheckIn: "2019-01-01",
      selectedCheckOut: "2019-01-01",
      displayCalendar: false,
      view: 'out',
      
    };

    this.getListing = this.getListing.bind(this);
    this.getSelectedDates = this.getSelectedDates.bind(this);
  }

  componentDidMount() {
    this.getListing();
  }

  getListing() {
    const random = Math.floor(Math.random() * 100);
    axios.get(`/listing/${random}`)
      .then((response) => {
        const { base_rate, currency, extra_guest_cap, extra_guest_charge, id, local_tax, max_guests,
          min_stay, review_count, star_rating } = response.data;
        
        this.setState({
          base_rate, currency, extra_guest_cap, extra_guest_charge, id, local_tax, max_guests,
          min_stay, review_count, star_rating
        }, () => {
          this.setState({
            displayCalendar: true,
          });
        });
      });
  }

  getSelectedDates(date) {
    const { view } = this.state.view;
    if (view === "in") {
      this.setState({
        selectedCheckIn: date,
      });
    } else {
      this.setState({
        selectedCheckOut: date,
      });
    }
  }

  render() {
    const { id, displayCalendar, view } = this.state;

    return (
      <div>
        <h4>Reservations</h4>
        {
          displayCalendar ? <Calendar id={id} view={view} getSelectedDates={this.getSelectedDates} /> : null
        }
      </div>
    );
  }
}

export default App;
