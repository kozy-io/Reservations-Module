import React, { Component } from 'react';

class Guest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      adult: 1,
      child: 0,
      infant: 0,
    };

    this.selectGuests = this.selectGuests.bind(this);
  }

  selectGuests(event) {
    event.preventDefault();
    const { name } = event.target;
    const { getSelectedGuests } = this.props;
    console.log(getSelectedGuests);

    if (name.includes('minus')) {
      if (name.includes('adult')) {
        this.setState(prevState => ({
          adult: prevState.adult - 1,
        }), () => {
          getSelectedGuests('adults', this.state.adult);
        });
      } else if (name.includes('child')) {
        this.setState(prevState => ({
          child: prevState.child - 1,
        }), () => {
          getSelectedGuests('children', this.state.child);
        });
      } else {
        this.setState(prevState => ({
          infant: prevState.infant - 1,
        }), () => {
          getSelectedGuests('infants', this.state.infant);
        });
      }
    } else if (name.includes('plus')) {
      if (name.includes('adult')) {
        this.setState(prevState => ({
          adult: prevState.adult + 1,
        }), () => {
          getSelectedGuests('adults', this.state.adult);
        });
      } else if (name.includes('child')) {
        this.setState(prevState => ({
          child: prevState.child + 1,
        }), () => {
          getSelectedGuests('children', this.state.child);
        });
      } else {
        this.setState(prevState => ({
          infant: prevState.infant + 1,
        }), () => {
          getSelectedGuests('infants', this.state.infant);
        });
      }
    }
  }

  render() {
    const { maxGuests } = this.props;
    const { adult, child, infant } = this.state;
    let adultStatusPlus;
    let adultStatusMinus;
    let childStatusPlus;
    let childStatusMinus;
    let infantStatusPlus;
    let infantStatusMinus;

    // it max guests are reached, add buttons are disabled for adult and child
    // infants do not count toward total guests
    if (adult + child >= maxGuests) {
      adultStatusPlus = 'button-disabled';
      childStatusPlus = 'button-disabled';
    }
    // adults cannot go below 1
    if (adult === 1) {
      adultStatusMinus = 'button-disabled';
    }
    // child and infant cannot go below 0 
    if (child === 0) {
      childStatusMinus = 'button-disabled';
    }
    if (infant === 0) {
      infantStatusMinus = 'button-disabled';
    }
    // infants cannot be above 5
    if (infant >= 5) {
      infantStatusPlus = 'button-disabled';
    }

    return (
      <div className="guest-form">
        <h1>Guest Bar</h1>

        <div id="guest-type">
          Adult
              <button name="adult-minus" className={adultStatusMinus} onClick={this.selectGuests}>-</button>
              <span>{adult}</span>
              <button name="adult-plus" className={adultStatusPlus} onClick={this.selectGuests}>+</button>
        </div>

          <div id="guest-type">
          Child
              <button name="child-minus" className={childStatusMinus} onClick={this.selectGuests}>-</button>
              <span>{child}</span>
              <button name="child-plus" className={childStatusPlus} onClick={this.selectGuests}>+</button>
          </div>
  
          <div id="guest-type">
          Infant
              <button name="infant-minus" className={infantStatusMinus} onClick={this.selectGuests}>-</button>
              <span>{infant}</span>
              <button name="infant-plus" className={infantStatusPlus} onClick={this.selectGuests}>+</button>
          </div>
      </div>
    );
  }
}

export default Guest;