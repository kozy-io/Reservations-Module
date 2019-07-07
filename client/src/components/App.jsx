import React from 'react';
import axios from 'axios';

import Calendar from './Calendar.jsx';
import Guest from './Guest.jsx';


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
      adults: 1,
      children: 0,
      infants: 0,
      
    };

    this.getListing = this.getListing.bind(this);
    this.getSelectedDates = this.getSelectedDates.bind(this);
    this.getSelectedGuests = this.getSelectedGuests.bind(this);
    this.displayGuest = this.displayGuest.bind(this);
    this.changeView = this.changeView.bind(this);
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
            displayCalendar: false,
          });
        });
      });
  }

  getSelectedDates(date) {
    let { view } = this.state;

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

  getSelectedGuests(type, number) {
    console.log('getting selected guests at parents');
    this.setState({
      [type]: number,
    });
  }

  displayGuest() {
    let currentDisplay = document.getElementById("overlay-guest").style.display;
    console.log(currentDisplay);
    if (currentDisplay === "none") {
      document.getElementById("overlay-guest").style.display = "block";
    }
    document.getElementById("overlay-guest").style.display = "block";
    console.log(currentDisplay);
  }

  changeView(event) {
    const { name } = event.target;
    this.setState(prevState => ({
      view: name,
      displayCalendar: !prevState.displayCalendar,
    }));
  }

  render() {
    const { id, displayCalendar, view, max_guests, star_rating, review_count, base_rate,
      adults, children, infants, displayGuest } = this.state;

    let displayGuests = "";
    let displayInfants = "";

    if (adults + children > 1) {
      displayGuests = `${adults + children} guests`;
    } else if (adults + children <= 1) {
      displayGuests = `${adults + children} guest`;
    }

    if (infants === 1) {
      displayInfants = `, 1 infant`;
    } else if (infants > 1) {
      displayInfants = `, ${infants} infants`;  
    }



    return (
      <div className="reservations-container">
        <div className="reservations-inner">
          <div className="price-displayed">${Number(base_rate)}</div>
          <div className="ratings-displayed">***** {review_count}</div>
          <p></p>
          <span className="titles">Dates</span>
          <div className="dates-options">
            <a name="in" className="options-text-checkin" onClick={(event) => {this.changeView(event)}}>Check-in</a>
            <a className="options-text-arrow"></a>
            <a className="options-text-checkout" name="out" onClick={(event) => {this.changeView(event)}}>Checkout</a>
          </div>
          <span className="titles">Guests</span>
          <div id="guests-display" onClick={this.displayGuest}>{displayGuests} {displayInfants}</div>
          {
            displayCalendar ? <Calendar id={id} view={view} getSelectedDates={this.getSelectedDates} /> : null
          }
          
          <Guest maxGuests={max_guests} getSelectedGuests={this.getSelectedGuests} /> 
          
        </div>

        
      </div>
    );
  }
}

export default App;
