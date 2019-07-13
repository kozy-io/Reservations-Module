/* eslint-disable no-undef */
import React from 'react';
import { shallow, mount } from 'enzyme';
import App from '../App';
import moment from 'moment';

const mockAxios = require('axios');

// eslint-disable-next-line no-undef
describe('App Display', () => {
  // eslint-disable-next-line no-undef 
  const wrapper = shallow(<App />);    
  it('renders without crashing', () => {
    expect(wrapper.exists()).toBe(true);
  });

  // it('test', () => {
  //   mockAxios.get.mockClear();
  //   const instance = wrapper.instance();
  //   instance.getListing();
  //   console.log(mockAxios.get.getMockName());
  //   console.log(mockAxios.get.mock.results);
  //   console.log(mockAxios.get.mock.calls);
  //   console.log(wrapper.state());

  //   expect(mockAxios.get).toHaveBeenCalledTimes(1);
  // });
});

describe('Date and Price Display', () => {
  it('if displayPricing is set to true, the pricing module should be shown ', () => {
    const wrapper = shallow(<App />);
    wrapper.setState({ displayPricing: true });

    const pricing = wrapper.find('.pricing');
    expect(pricing.length).toBe(2);
  });

  it('if displayPricing is set to false, the pricing module should not be shown ', () => {
    const wrapper = shallow(<App />);
    wrapper.setState({ displayPricing: false });

    const pricing = wrapper.find('.pricing');
    expect(pricing.length).toBe(1);
  });
});

describe('Pricing Validation', () => {
  const wrapper = shallow(<App />);
  it('should properly calculate total base price, given no custom rates', () => {
    const wrapper = shallow(<App />);

    wrapper.setState({
      id: 1,
      selectedCheckIn: moment('2019-07-21', 'YYYY-MM-DD'),
      selectedCheckOut: moment('2019-07-27', 'YYYY-MM-DD'),
      base_rate: 100,
      total_base: 0,
    });
    const result = 6 * 100;
    const instance = wrapper.instance();
    instance.calculateBase([]);
    expect(wrapper.state('total_base')).toBe(result);
  });

  it('should properly set displayPricing to true after calculating total base price', () => {
    const wrapper = shallow(<App />);
    wrapper.setState({
      id: 1,
      selectedCheckIn: moment('2019-07-21', 'YYYY-MM-DD'),
      selectedCheckOut: moment('2019-07-27', 'YYYY-MM-DD'),
      displayPricing: false,
    });
    const result = true;
    const instance = wrapper.instance();
    instance.calculateBase([]);
    expect(wrapper.state('displayPricing')).toBe(result);
  });

  it('should properly calculate total base price, given custom rates', () => {
    const wrapper = shallow(<App />);
    wrapper.setState({
      id: 1,
      selectedCheckIn: moment('2019-07-21', 'YYYY-MM-DD'),
      selectedCheckOut: moment('2019-07-25', 'YYYY-MM-DD'),
      base_rate: 100,
      total_base: 0,
    });

    const customRates = [
      {
        date: "2019-07-21",
        price: "200",
      },
      {
        date: "2019-07-22",
        price: "200",
      },
      {
        date: "2019-07-23",
        price: "200",
      },
    ];

    const result = (200 * 3) + (100);
    const instance = wrapper.instance();
    instance.calculateBase(customRates);
    expect(wrapper.state('total_base')).toBe(result);
  });

  it('should properly calculate the aggregate extra guest fee given the number of guests and extra guest charge per the respective listing', () => {
    wrapper.setState({
      adults: 3,
      children: 2,
      extra_guest_cap: 2,
      extra_guest_charge: 100,
      selectedCheckIn: moment('2019-07-01', 'YYYY-MM-DD'),
      selectedCheckOut: moment('2019-07-05', 'YYYY-MM-DD'),
    });
    let calculatedFee = 4 * 3 * 100;
    wrapper.instance().calculateExtraGuests();

    expect(wrapper.state('extraGuestFee')).toBe(calculatedFee);
  });

  it('should properly calculate and set state to the duration, given a check in and check out date', () => {
    const wrapper = shallow(<App />);
    const instance = wrapper.instance();
    const mockCalculateExtraGuests = jest.fn();
    const mockGetCustomRates = jest.fn();

    instance.calculateExtraGuests = mockCalculateExtraGuests;
    instance.mockGetCustomRates = mockGetCustomRates;

    wrapper.setState({
      selectedCheckIn: moment('2019-07-01', 'YYYY-MM-DD'),
      selectedCheckOut: moment('2019-07-05', 'YYYY-MM-DD'),
    });

    instance.getDuration();
    const result = 4;
    expect(wrapper.state('duration')).toBe(result);
  });
});

describe('Accepting and Clearing Dates', () => {
  const wrapper = shallow(<App />);
  it('should change state for selected dates based on passed in parameters', () => {

    wrapper.setState({ view: 'in' });

    const instance = wrapper.instance();

    const date = moment('2019-01-01', 'YYYY-MM-DD');

    instance.getSelectedDates(date, false);
    expect(wrapper.state('selectedCheckIn')).toBe(date);

    wrapper.setState({ view: 'out' });
    instance.getSelectedDates(date, false);
    expect(wrapper.state('selectedCheckOut')).toBe(date);
  });

  it('should clear dates from state when clearSelectedDates is called', () => {
    wrapper.setState({
      selectedCheckIn: moment('2019-05-25', 'YYYY-MM-DD'),
      selectedCheckOut: moment('2019-06-30', 'YYYY-MM-DD'),
    });

    const instance = wrapper.instance();
    instance.clearSelectedDates();

    expect(wrapper.state('selectedCheckIn')).toBe(null);
    expect(wrapper.state('selectedCheckOut')).toBe(null);
  });
});

describe('Accepting and Displaying Guests', () => {
  it('should set state to the guests that are passed in', () => {
    const wrapper = shallow(<App />);
    const instance = wrapper.instance();
    const mockCalculateExtraGuests = jest.fn();

    wrapper.setState({
      adults: null,
      children: null,
      infants: null,
    });

    instance.getSelectedGuests('adults', 5);
    expect(wrapper.state('adults')).toBe(5);

    instance.getSelectedGuests('children', 10);
    expect(wrapper.state('children')).toBe(10);

    instance.getSelectedGuests('infants', 20);
    expect(wrapper.state('infants')).toBe(20);
  });
});

describe('Showing and hiding Guest and Calendar', () => {
  it('should change the display status of Guest when displayGuest is invoked', () => {
    const wrapper = mount(<App />, { attachTo: document.body });
    wrapper.setState({ showGuest: false });
    const instance = wrapper.instance();
    instance.displayGuest();
    expect(wrapper.state('showGuest')).toBe(true);

    instance.displayGuest();
    expect(wrapper.state('showGuest')).toBe(false);
  });

  it('should change the display status of Calendar when displayCalendar is invoked', () => {
    // const wrapper = mount(<App />, { attachTo: document.body });
    // const instance = wrapper.instance();
    // wrapper.setState({ showCalendar: false });
    // instance.displayCalendar({ target: 'in' });
    // expect(wrapper.state('view')).toBe('in');
    // expect(wrapper.state('showCalendar')).toBe(true);

    // // instance.displayCalendar({ target: 'out' });
    // // expect(wrapper.state('view')).toBe('out');
    // // expect(wrapper.state('showCalendar')).toBe(false);
  });
});
