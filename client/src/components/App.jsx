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
      id: 0,
      local_tax: 0.09,
      max_guests: 0,
      min_stay: 0,
      review_count: 0,
      star_rating: 0,
    };

    this.getListing = this.getListing.bind(this);
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
        })
      });
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
