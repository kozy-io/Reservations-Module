import React, { Component } from 'react';

class Guest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      adult: 0,
      child: 0,
      infant: 0,
    };

    this.selectGuests = this.selectGuests.bind(this);
  }

  selectGuests(event) {
    event.preventDefault();
    const { name } = event.target;

    if (name.includes('minus')) {
      if (name.includes('adult')) {
        this.setState(prevState => ({
          adult: prevState.adult - 1,
        }));
      } else if (name.includes('child')) {
        this.setState(prevState => ({
          child: prevState.child - 1,
        }));
      } else {
        this.setState(prevState => ({
          infant: prevState.infant - 1,
        }));
      }
    } else if (name.includes('plus')) {
      if (name.includes('adult')) {
        this.setState(prevState => ({
          adult: prevState.adult + 1,
        }));
      } else if (name.includes('child')) {
        this.setState(prevState => ({
          child: prevState.child + 1,
        }));
      } else {
        this.setState(prevState => ({
          infant: prevState.infant + 1,
        }));
      }
    }
  }

  render() {
    const { maxGuests } = this.props;
    const { adult, child, infant } = this.state;
    return (
      <div className="guest-form">
        <h1>Guest Bar</h1>

        <div id="guest-type">
          Adult
              <button name="adult-minus" onClick={this.selectGuests}>-</button>
              <span>{adult}</span>
              <button name="adult-plus" onClick={this.selectGuests}>+</button>
        </div>

          <div id="guest-type">
          Child
              <button name="child-minus" onClick={this.selectGuests}>-</button>
              <span>{child}</span>
              <button name="child-plus" onClick={this.selectGuests}>+</button>
          </div>
  
          <div id="guest-type">
          Infant
              <button name="infant-minus" onClick={this.selectGuests}>-</button>
              <span>{infant}</span>
              <button name="infant-plus" onClick={this.selectGuests}>+</button>
          </div>

      

      </div>
    )
  }
}

export default Guest;