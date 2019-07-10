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
    this.handleClick = this.handleClick.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick, false);
  }

  handleClick(e) {
    if (this.node.contains(e.target)) {
      return;
    }
    this.handleClickOutside();
  }

  handleClickOutside() {
    document.getElementById('overlay-guest').style.display = 'none';
  }

  selectGuests(event, name) {
    event.preventDefault();
    const { getSelectedGuests } = this.props;

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
    let adultStatusPlus = "button-plus-outer";
    let adultStatusMinus = "button-minus-outer";
    let childStatusPlus = "button-plus-outer";
    let childStatusMinus = "button-minus-outer";
    let infantStatusPlus = "button-plus-outer";
    let infantStatusMinus = "button-minus-outer";

    // it max guests are reached, add buttons are disabled for adult and child
    // infants do not count toward total guests
    if (adult + child >= maxGuests) {
      adultStatusPlus = 'button-plus-outer-disabled';
      childStatusPlus = 'button-plus-outer-disabled';
    }
    // adults cannot go below 1
    if (adult === 1) {
      adultStatusMinus = 'button-minus-outer-disabled';
    }
    // child and infant cannot go below 0
    if (child === 0) {
      childStatusMinus = 'button-minus-outer-disabled';
    }
    if (infant === 0) {
      infantStatusMinus = 'button-minus-outer-disabled';
    }
    // infants cannot be above 5
    if (infant >= 5) {
      infantStatusPlus = 'button-plus-outer-disabled';
    }

    return (
      <div ref={node => this.node = node}>
        <div id="overlay-guest">
          <div className="guest-outer-container">
          <div className="_10ejfg4u">
            <div className="_mke2gl1">
              Adults
            </div>
          </div>
          
          <div className="_ni9axhe">
            <div className="_1fb7ddvw">
              <div className="_7eamzqx">
                <button type="button" className={adultStatusMinus}>
                <span className="button-minus-inner">
                <svg viewBox="0 0 24 24" role="img" aria-label="subtract" focusable="false"
                onClick={(event) => {this.selectGuests(event, "adult-minus")}}>
                <rect height="2" rx="1" width="12" x="6" y="11" /></svg>
                </span>
                </button>
              </div>
            
            <div className="_zac1rbz">{adult}</div>
              <div className="_1a72ixey">
                <button name="adult-plus" className={adultStatusPlus}>
                <span className="button-plus-inner">
                <svg viewBox="0 0 24 24" role="img" aria-label="add" focusable="false" 
                onClick={(event) => {this.selectGuests(event, "adult-plus")}}>
                <rect height="2" rx="1" width="12" x="6" y="11" />
                <rect height="12" rx="1" width="2" x="11" y="6" />
                </svg>
                </span>          
                </button>
              </div>
            </div>
          </div>
          <p></p>
          <div className="_10ejfg4u">
          <div className="_mke2gl1">
            Children
            <div className="_1pjh0qr">
              <div className="_1jlnvra2">
                Ages 2–12
              </div>
            </div>
          </div>
        </div>
        
        <div className="_ni9axhe">
          <div className="_1fb7ddvw">
            <div className="_7eamzqx">
              <button type="button" className={childStatusMinus}>
              <span className="button-minus-inner">
              <svg viewBox="0 0 24 24" role="img" aria-label="subtract" focusable="false"
              onClick={(event) => {this.selectGuests(event, "child-minus")}}>
              <rect height="2" rx="1" width="12" x="6" y="11" /></svg>
              </span>
              </button>
            </div>
          
          <div className="_zac1rbz">{child}</div>
            <div className="_1a72ixey">
              <button name="adult-plus" className={childStatusPlus}>
              <span className="button-plus-inner">
              <svg viewBox="0 0 24 24" role="img" aria-label="add" focusable="false" 
              onClick={(event) => {this.selectGuests(event, "child-plus")}}>
              <rect height="2" rx="1" width="12" x="6" y="11" />
              <rect height="12" rx="1" width="2" x="11" y="6" />
              </svg>
              </span>          
              </button>
            </div>
          </div>
        </div>
        <p></p>
        <div className="_10ejfg4u">
            <div className="_mke2gl1">
              Infants
              <div className="_1pjh0qr">
              <div className="_1jlnvra2">
                Under 2
              </div>
            </div>
            </div>
          </div>
          
          <div className="_ni9axhe">
            <div className="_1fb7ddvw">
              <div className="_7eamzqx">
                <button type="button" className={infantStatusMinus}>
                <span className="button-minus-inner">
                <svg viewBox="0 0 24 24" role="img" aria-label="subtract" focusable="false"
                onClick={(event) => {this.selectGuests(event, "infant-minus")}}>
                <rect height="2" rx="1" width="12" x="6" y="11" /></svg>
                </span>
                </button>
              </div>
            
            <div className="_zac1rbz">{infant}</div>
              <div className="_1a72ixey">
                <button name="adult-plus" className={infantStatusPlus}>
                <span className="button-plus-inner">
                <svg viewBox="0 0 24 24" role="img" aria-label="add" focusable="false" 
                onClick={(event) => {this.selectGuests(event, "infant-plus")}}>
                <rect height="2" rx="1" width="12" x="6" y="11" />
                <rect height="12" rx="1" width="2" x="11" y="6" />
                </svg>
                </span>          
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    );
  }
}

export default Guest;
