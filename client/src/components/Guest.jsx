import React, { Component } from 'react';

class Guest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      adults: 0,
      children: 0,
      infants: 0,
    };
  }

  render() {
    const { maxGuests } = this.props;
    return (
      <div className="guest-form">
        <h1>Guest Bar</h1>

        <div id="guest-type">
          Adult
              <button>-</button>
              <span> 0 </span>
              <button>+</button>
        </div>

          <div id="guest-type">
          Child
              <button>-</button>
              <span> 0 </span>
              <button>+</button>
          </div>
  
          <div id="guest-type">
          Infant
              <button>-</button>
              <span> 0 </span>
              <button>+</button>
          </div>

      

      </div>
    )
  }
}

export default Guest;