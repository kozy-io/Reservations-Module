/* eslint-disable react/jsx-wrap-multilines */
import React from 'react';
import axios from 'axios';
import moment from 'moment';
import NumberFormat from 'react-number-format';

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
      cleaning_charge: 100,
      max_guests: 0,
      min_stay: 0,
      review_count: 0,
      star_rating: 0,
      selectedCheckIn: null,
      selectedCheckOut: null,
      displayCalendar: false,
      view: null,
      adults: 1,
      children: 0,
      infants: 0,
      showGuest: false,
      showCalendar: false,
      displayPricing: false,
      total_base: null,
      duration: null,
      
    };

    this.getListing = this.getListing.bind(this);
    this.getSelectedDates = this.getSelectedDates.bind(this);
    this.getSelectedGuests = this.getSelectedGuests.bind(this);
    this.displayGuest = this.displayGuest.bind(this);
    this.changeView = this.changeView.bind(this);
    this.styleDisplayDate = this.styleDisplayDate.bind(this);
    this.validateStay = this.validateStay.bind(this);
    this.calculateBase = this.calculateBase.bind(this);
    this.hideCalendar = this.hideCalendar.bind(this);
    this.calculateExtraGuests = this.calculateExtraGuests.bind(this);
  }

  componentDidMount() {
    this.getListing();
  }


  getListing() {
    // const random = Math.floor(Math.random() * 100);
    const random = 1;
    axios.get(`/listing/${random}`)
      .then((response) => {
        const { base_rate, currency, extra_guest_cap, extra_guest_charge, id, local_tax, max_guests,
          min_stay, review_count, star_rating } = response.data;
        
        this.setState({
          currency, extra_guest_cap, extra_guest_charge, id, local_tax, max_guests,
          min_stay, review_count, star_rating, base_rate: Number(base_rate),
        }, () => {
          this.setState({
            displayCalendar: false,
          });
        });
      });
  }

  getSelectedDates(date) {
    let { view } = this.state;

    if (view === 'in') {
      this.setState({
        selectedCheckIn: date,
      }, () => {
        this.validateStay();
      });
    } else {
      this.setState({
        selectedCheckOut: date,
      }, () => {
        this.validateStay();
      });
    }
  }

  getSelectedGuests(type, number) {
    console.log('getting selected guests at parents');
    const { adults, children } = this.state;
    let previousTotal = adults + children;
    this.setState({
      [type]: number,
    }, () => {
      this.calculateExtraGuests(previousTotal);
    });
  }

  displayGuest() {
    if (this.state.showGuest === false) {
      this.setState(prevState => ({
        showGuest: !prevState.showGuest,
      }), () => {
        document.getElementById('overlay-guest').style.display = 'block';
      });
    } else {
      this.setState(prevState => ({
        showGuest: !prevState.showGuest,
      }), () => {
        document.getElementById('overlay-guest').style.display = 'none';
      });
    }
  }

  displayCalendar(event) {
    const { name } = event.target;
    this.setState({
      view: name,
    }, () => {
      if (this.state.showCalendar === false) {
        this.setState(prevState => ({
          showCalendar: !prevState.showCalendar,
        }), () => {
          document.getElementById('overlay-calendar').style.display = 'block';
        });
      } else {
        this.setState(prevState => ({
          showCalendar: !prevState.showCalendar,
        }), () => {
          document.getElementById('overlay-calendar').style.display = 'none';
        });
      }
    });
  }

  hideCalendar() {
    this.setState({
      showCalendar: false,
    })
  }

  changeView(event) {
    const { name } = event.target;
    this.setState(prevState => ({
      view: name,
      displayCalendar: !prevState.displayCalendar,
    }));
  }

  styleDisplayDate(date) {
    let data = date.split('-');
    return data[1] + '/' + data[2] + '/' + data[0];
  }

  validateStay(reserved) {
    const { selectedCheckIn, selectedCheckOut, min_stay } = this.state;
    // work only with the current month 
    if (selectedCheckIn && selectedCheckOut) {
      const dateIn = moment(selectedCheckIn);
      const dateOut = moment(selectedCheckOut);
      const duration = dateOut.diff(dateIn, 'days');

      if (duration >= min_stay) {
        console.log('this is a valid stay!');
        this.setState({
          duration,
        }, () => {
          this.calculateBase();
        });
      } else {
        console.log('this is not a valid stay');
      }
    }
    return;
  }

  calculateBase() {
    // make a get request for any custom pricing for the month you are in 
    // then, check each one (start at check in, end at check out ) 
    // keep track of total stay 
    const { id, selectedCheckIn, selectedCheckOut } = this.state;

    const dateIn = moment(selectedCheckIn);
    const dateOut = moment(selectedCheckOut);
    const daysBetween = [];
    let query = '';
    let total = 0;
    
    for (let m = moment(dateIn); m.isBefore(dateOut); m.add(1, 'days')) {
      daysBetween.push(m.format('YYYY-MM-DD'));
    }

    for (let i = 0; i < daysBetween.length; i += 1) {
      query += '&time=' + daysBetween[i];
    }

    axios.get(`/custom/month?id=${id}${query}`)
      .then((response) => {
        const customDatesOnly = response.data.map(element => element.date);
        const customPricesOnly = response.data.map(item => item.price);

        for (let j = moment(dateIn); j.isBefore(dateOut); j.add(1, 'days')) {
          let item = (j.format('YYYY-MM-DD'));
          let index = customDatesOnly.indexOf(item);

          if (index >= 0) {
            total += Number(customPricesOnly[index]);
          } else {
            total += this.state.base_rate;
          }
        }
        this.setState({ total_base: total }, () => {
          this.setState({ displayPricing: true });
        });
      });
  }

  calculateExtraGuests(previousTotal) {
    const { adults, children, extra_guest_cap, extra_guest_charge } = this.state;
    let prevAddlCharge;
    if (previousTotal > extra_guest_cap) {
      prevAddlCharge = (previousTotal - extra_guest_cap) * extra_guest_charge;
    } else {
      prevAddlCharge = 0;
    }

    let currTotal = adults + children;
    let currAddlCharge;
    if (currTotal > extra_guest_cap) {
      currAddlCharge = (currTotal - extra_guest_cap) * extra_guest_charge;
    } else {
      currAddlCharge = 0;
    }

    let chargeDiff = currAddlCharge - prevAddlCharge;

    console.log("charge difference", chargeDiff);

    this.setState(prevState => ({
      total_base: prevState.total_base + chargeDiff,
    }));
  }

  render() {
    const { id, displayCalendar, view, max_guests, star_rating, review_count, base_rate, cleaning_charge, local_tax,
      adults, children, infants, selectedCheckIn, selectedCheckOut, displayPricing, total_base, duration } = this.state;

    let displayGuests = '';
    let displayInfants = '';

    if (adults + children > 1) {
      displayGuests = `${adults + children} guests`;
    } else if (adults + children <= 1) {
      displayGuests = `${adults + children} guest`;
    }

    if (infants === 1) {
      displayInfants = ', 1 infant';
    } else if (infants > 1) {
      displayInfants = `, ${infants} infants`;  
    }

    // if duration does not exist (no dates have been selected), then display the base_rate
    // if duration does not exist but adults + children > 1 (meaning guests have been selected), then display total_base/1
    // if duration does exist, display perNight 
    let perNight;
    if (duration) {
      perNight = Math.round(total_base / duration);
    } else if (!duration && adults + children > 1) {
      perNight = base_rate + total_base; // total base would only include the additional guest charge at this point since no dates selected
    }
    // let perNight = Math.round(total_base / duration);
    let serviceCharge = total_base * .08;
    let occupancyFees = local_tax * (total_base + serviceCharge + cleaning_charge);
    let aggregate = total_base + serviceCharge + occupancyFees + cleaning_charge;


    return (
      <div className="reservations-container">
        <div className="reservations-inner">
          <div className="price-displayed">${ perNight || base_rate}</div>
          <div className="ratings-displayed">***** {review_count}</div>
          <p />

          <span className="titles">Dates</span>
          <div className="dates-options">
            <a name="in" className="options-text-checkin" onClick={(event) => {this.displayCalendar(event);}}>
              { selectedCheckIn ? this.styleDisplayDate(selectedCheckIn) : 'Check-in' }</a>
            <a className="options-text-checkout" name="out" onClick={(event) => {this.displayCalendar(event);}}>
              { selectedCheckOut ? this.styleDisplayDate(selectedCheckOut) : 'Checkout' }</a>
          </div>

          <Calendar id={id} view={view} getSelectedDates={this.getSelectedDates} hideCalendar={this.hideCalendar} />

          <span className="titles">Guests</span>
          <div id="guests-display" onClick={this.displayGuest}>{displayGuests} {displayInfants}</div>
          <Guest maxGuests={max_guests} getSelectedGuests={this.getSelectedGuests} />

          { displayPricing ?
          <div className="pricing">
            <div id="text-base-fee-description">${perNight} x {duration} {duration > 1 ? 'nights' : 'night' }
              <div className="right">
                <NumberFormat value={total_base} displayType={'text'} 
                  thousandSeparator={true} prefix={'$'} decimalScale={0}/>
              </div>
            </div>

            <div id="text-misc-fees-description">
              Cleaning fee
              <div className="right">${cleaning_charge}</div>
              <p></p>
              Service charge
              <div className="right">
                <NumberFormat value={serviceCharge} displayType={'text'} 
                  thousandSeparator={true} prefix={'$'} decimalScale={0}/>
              </div>
            </div>
            
            <div id="text-taxes">Occupancy taxes and fees
            <div className="right">
            <NumberFormat value={occupancyFees} displayType={'text'} 
            thousandSeparator={true} prefix={'$'} decimalScale={0}/></div>
          </div>
            <div id="total-price">Total
              <div className="right"><NumberFormat value={aggregate} displayType={'text'} 
                thousandSeparator={true} prefix={'$'} decimalScale={0}/></div>
            </div>
          </div>
          : null }

        </div>
      </div>
    );
  }
}

export default App;
