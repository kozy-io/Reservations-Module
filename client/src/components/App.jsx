/* eslint-disable camelcase */
/* eslint-disable react/jsx-wrap-multilines */
import React from 'react';
import axios from 'axios';
import moment from 'moment';
import NumberFormat from 'react-number-format';
import Calendar from './Calendar.jsx';
import Guest from './Guest.jsx';

import styles from '../styles/app.css';


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
      extraGuestFee: 0,
    };

    this.getListing = this.getListing.bind(this);
    this.getSelectedDates = this.getSelectedDates.bind(this);
    this.getSelectedGuests = this.getSelectedGuests.bind(this);
    this.displayGuest = this.displayGuest.bind(this);
    this.changeView = this.changeView.bind(this);
    this.getDuration = this.getDuration.bind(this);
    this.calculateBase = this.calculateBase.bind(this);
    this.hideCalendar = this.hideCalendar.bind(this);
    this.calculateExtraGuests = this.calculateExtraGuests.bind(this);
    this.styleNumber = this.styleNumber.bind(this);
    this.clearSelectedDates = this.clearSelectedDates.bind(this);
    this.getCustomRates = this.getCustomRates.bind(this);
  }

  componentDidMount() {
    this.getListing();
  }

  getListing() {
    const parts = window.location.href.split('/');
    const id = parts[parts.length - 2];
    console.log(id);
    axios.get(`/listing/${id}`)
      .then((response) => {
        const { base_rate, currency, extra_guest_cap, extra_guest_charge, id, local_tax, max_guests,
          min_stay, review_count, star_rating,
        } = response.data;
        
        this.setState({
          currency, extra_guest_cap, extra_guest_charge, id, local_tax, max_guests,
          min_stay, review_count, star_rating, base_rate: Number(base_rate),
        }, () => {
          this.setState({ displayCalendar: false });
        });
      }).catch((error) => { throw error; });
  }

  getSelectedDates(date, status) {
    const { view } = this.state;
    if (view === 'in') {
      this.setState({
        selectedCheckIn: date,
        view: 'out',
      }, () => {
        if (status === true) {
          this.getDuration();
        }
      });
    } else {
      this.setState({
        selectedCheckOut: date,
        view: 'in',
      }, () => {
        if (status === true) {
          this.getDuration();
        }
      });
    }
  }

  // eslint-disable-next-line react/sort-comp
  clearSelectedDates() {
    this.setState({
      selectedCheckIn: null,
      selectedCheckOut: null,
      displayPricing: false,
    });
  }

  getSelectedGuests(type, number) {
    this.setState({
      [type]: number,
    }, () => { this.calculateExtraGuests(); });
  }

  displayGuest() {
    const { showGuest } = this.state;
    if (showGuest === false) {
      this.setState(prevState => ({
        showGuest: !prevState.showGuest,
      }), () => { document.getElementById('overlayGuest').style.display = 'block'; });
    } else {
      this.setState(prevState => ({
        showGuest: !prevState.showGuest,
      }), () => { document.getElementById('overlayGuest').style.display = 'none'; });
    }
  }

  displayCalendar(event) {
    const { name } = event.target;
    const { showCalendar } = this.state;
    this.setState({
      view: name,
    }, () => {
      if (showCalendar === false) {
        this.setState(prevState => ({
          showCalendar: !prevState.showCalendar,
        }), () => { document.getElementById('overlayCalendar').style.display = 'block'; });
      } else {
        this.setState(prevState => ({
          showCalendar: !prevState.showCalendar,
        }), () => { document.getElementById('overlayCalendar').style.display = 'none'; });
      }
    });
  }

  hideCalendar() {
    this.setState({
      showCalendar: false,
      view: null,
    });
  }

  changeView(event) {
    const { name } = event.target;
    this.setState(prevState => ({
      view: name,
      displayCalendar: !prevState.displayCalendar,
    }));
  }

  getDuration() {
    const { selectedCheckIn, selectedCheckOut } = this.state;
    if (selectedCheckIn && selectedCheckOut) {
      const dateIn = selectedCheckIn;
      const dateOut = selectedCheckOut;
      const duration = dateOut.diff(dateIn, 'days');

      this.setState({ duration }, () => {
        this.calculateExtraGuests(this.getCustomRates);
      });
    }
  }

  getCustomRates() {
    const { id, selectedCheckIn, selectedCheckOut } = this.state;
    const dateIn = selectedCheckIn;
    const dateOut = selectedCheckOut;
    const daysBetween = [];
    let query = '';
    
    for (let m = moment(dateIn); m.isBefore(dateOut); m.add(1, 'days')) {
      daysBetween.push(m.format('YYYY-MM-DD'));
    }

    for (let i = 0; i < daysBetween.length; i += 1) {
      query += `&time=${daysBetween[i]}`;
    }

    axios.get(`/custom/month?id=${id}${query}`)
      .then((response) => {
        this.calculateBase(response.data);
      });
  }

  calculateBase(data) {
    const { id, selectedCheckIn, selectedCheckOut, base_rate } = this.state;
    const dateIn = selectedCheckIn;
    const dateOut = selectedCheckOut;
    let total = 0;
  
    const customDatesOnly = data.map(element => element.date);
    const customPricesOnly = data.map(item => item.price);

    for (let j = moment(dateIn); j.isBefore(dateOut); j.add(1, 'days')) {
      let item = (j.format('YYYY-MM-DD'));
      let index = customDatesOnly.indexOf(item);
      if (index >= 0) {
        total += Number(customPricesOnly[index]);
      } else {
        total += base_rate;
      }
    }
    this.setState({ total_base: total }, () => {
      this.setState({ displayPricing: true });
    });
  }

  calculateExtraGuests(callback = () => {}) {
    const {
      adults, children, extra_guest_cap, extra_guest_charge,
      selectedCheckIn, selectedCheckOut,
    } = this.state;

    const totalGuests = adults + children;
    let extraCharge = 0;
    let stayInDays = 1;

    if (selectedCheckIn && selectedCheckOut) {
      stayInDays = selectedCheckOut.diff(selectedCheckIn, 'days');
    }

    if (totalGuests > extra_guest_cap) {
      extraCharge = (totalGuests - extra_guest_cap) * extra_guest_charge * stayInDays;
    }

    this.setState({ extraGuestFee: extraCharge }, () => { callback(); });
  }

  // eslint-disable-next-line class-methods-use-this
  styleNumber(number) {
    return <NumberFormat value={number} displayType={'text'} 
    thousandSeparator={true} prefix={'$'} decimalScale={0}/>;
  }

  render() {
    const { id, displayCalendar, view, max_guests, star_rating, review_count, min_stay, base_rate, cleaning_charge, local_tax, showGuest,
      adults, children, infants, selectedCheckIn, selectedCheckOut, displayPricing, total_base, duration, extraGuestFee } = this.state;

    const ratingClass = 'ratings' + Math.ceil(star_rating);

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

    let checkInView;
    let checkOutView;
    if (view === 'out') {
      checkOutView = <div id={styles.checkBackground}>Checkout</div>;
      checkInView = 'Check-in';
    } else if (view === 'in') {
      checkInView = <div id={styles.checkBackground}>Check-in</div>;
      checkOutView = 'Checkout';
    } else {
      checkInView = 'Check-in';
      checkOutView = 'Checkout';
    }

    let perNight;
    if (duration) {
      perNight = Math.round((total_base + extraGuestFee) / duration);
    } else if (!duration && adults + children > 1) {
      perNight = base_rate + extraGuestFee; // total base would only include the additional guest charge at this point since no dates selected
    } else {
      perNight = base_rate;
    }

    let serviceCharge = (total_base + extraGuestFee) * .08;
    let occupancyFees = local_tax * (total_base + extraGuestFee + serviceCharge + cleaning_charge);
    let aggregate = total_base + extraGuestFee + serviceCharge + occupancyFees + cleaning_charge;


    return (
      <div className={styles.reservationsContainer}>
        <div className={styles.reservationsInner}>

          <div className={styles.reservationsHeader}>
            <div className={styles.reservationsHeaderPrice}>
              <span className={styles.priceDisplayed}>{ this.styleNumber(perNight) || this.styleNumber(base_rate)}</span>
              <span className={styles.priceText}>per night</span>
            </div>

            <div>
              <button className={styles.reviewsButton}>
              <span role="img" className={`${styles.ratingsImage} ${styles[ratingClass]}`}></span>
              </button>
              <span className={styles.reviewsNumber}> {review_count}</span>
            </div>

          </div>

          <div className={styles.datesContainer}>
            <span className={styles.titles}>Dates</span>
            
            <div className={styles.dateDisplayWrapper}>
              <div className={styles.dateCheckinWrapper}>
                <div className={styles.dateCheckinText}>
                  <a name="in" onClick={(event) => {this.displayCalendar(event);}}>
                  { selectedCheckIn ? selectedCheckIn.format('MM/DD/YYYY') : checkInView}
                  </a>
                </div>
              </div>

              <div className={styles.dateArrowWrapper}>
                <svg viewBox="0 0 24 24">
                  <path
                    d="m0 12.5a.5.5 0 0 0 .5.5h21.79l-6.15 6.15a.5.5 0 1 0 .71.71l7-7v-.01a.5.5 0 0 0 
                    .14-.35.5.5 0 0 0 -.14-.35v-.01l-7-7a .5.5 0 0 0 -.71.71l6.15 6.15h-21.79a.5.5 
                    0 0 0 -.5.5z"
                    fillRule="evenodd"
                  />
                </svg>
              </div>
                  
            <div className={styles.dateCheckoutWrapper}>
              <div className={styles.dateCheckoutText}>
                <a name="out" onClick={(event) => {this.displayCalendar(event);}}>
                { selectedCheckOut ? selectedCheckOut.format('MM/DD/YYYY') : checkOutView }</a>
              </div>
            </div>

          </div>
        </div>

          { this.state.id ? 
            <Calendar
              id={id}
              view={view}
              getSelectedDates={this.getSelectedDates}
              hideCalendar={this.hideCalendar}
              clearSelectedDates={this.clearSelectedDates}
              minStay={min_stay}
            />
          : null }
          
          <div className={styles.guestBarContainer}>
            <span className={styles.titles}>Guests</span>
          
            <div className="guests-display-table">
          
              <div id={styles.guestsDisplay} onClick={this.displayGuest}>
                <div className={styles.guestsDisplayText}>
                {displayGuests} {displayInfants}
                </div>
              </div>
            </div>
          </div>
  
          <Guest maxGuests={max_guests} getSelectedGuests={this.getSelectedGuests} />

          { displayPricing ?
            <div className={styles.pricing}>
              <div className={styles.pricingInnerContainer}>
                <div className={styles.pricingDescriptionContainer}>
                  <span className={styles.pricingDescription}>
                    {this.styleNumber(perNight)} x {duration} {duration > 1 ? 'nights' : 'night' }
                  </span>
                </div>
                <div className={styles.pricingAmountContainer}>
                  <span className={styles.pricingAmount}>{this.styleNumber(total_base + extraGuestFee)}</span>
                </div>
              </div>

              <div className={styles.pricingSeparationContainer}>
                <div className={styles.separation}></div>
              </div>

              <div className={styles.pricingInnerContainer}>
                <div className={styles.pricingDescriptionContainer}>
                  <span className={styles.pricingDescription}>
                    Cleaning fee
                  </span>
                </div>
                
                <div className={styles.pricingAmountContainer}>
                  <span className={styles.pricingAmount}>${cleaning_charge}</span>
                </div>
              </div>

              <div className={styles.pricingSeparationContainer}>
                <div className={styles.separation}></div>
              </div>

              <div className={styles.pricingInnerContainer}>
                <div className={styles.pricingDescriptionContainer}>
                  <span className={styles.pricingDescription}>
                    Service charge
                  </span>
                </div>
                <div className={styles.pricingAmountContainer}>
                  <span className={styles.pricingAmount}>
                    {this.styleNumber(serviceCharge)}
                  </span>
                </div>
              </div>

              <div className={styles.pricingSeparationContainer}>
                <div className={styles.separation}></div>
              </div>

              <div className={styles.pricingInnerContainer}>
                <div className={styles.pricingDescriptionContainer}>
                  <span className={styles.pricingDescription}>
                    Occupancy taxes and fees
                  </span>
                </div>
                <div className={styles.pricingAmountContainer}>
                  <span className={styles.pricingAmount}>
                    {this.styleNumber(occupancyFees)}
                  </span>
                </div>
              </div>

              <div className={styles.pricingSeparationContainerOuter}>
              </div>

              <div className={styles.pricingInnerContainer}>
                <div className={styles.pricingDescriptionContainer}>
                  <span className={styles.pricingTotal}>
                    Total
                  </span>
                </div>
                <div className={styles.pricingAmountContainer}>
                  <span className={styles.pricingTotal}>
                    {this.styleNumber(aggregate)}
                  </span>
                </div>
              </div>
            </div>
            : null }
            <div className={styles.pricing}>
              <div id={styles.bookingButton}>
                <button type="submit" className={styles.booking}>
                    Request to Book
                </button>
                <div className={styles.disclaimer}>
                  You won't be charged yet.
                </div>
              </div>
            </div>
        <div className={styles.highlights}>
            <div className={styles.highlightsText}>
              <span className={styles.highlightsTextMain}>
                This place is a rare find.
              </span>
              <div className={styles.highlightsTextBottom}>
              Katherine's place is usually booked. Grab it while you can!
              </div>
            </div>
        </div>
        </div>
      </div>
    );
  }
}

export default App;
