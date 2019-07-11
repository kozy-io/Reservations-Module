import React from 'react';
import { shallow, mount } from 'enzyme';
import App from '../App';


// eslint-disable-next-line no-undef
describe('App Display', () => {
  // eslint-disable-next-line no-undef
  
  it('renders without crashing', () => {
    const wrapper = shallow(<App />);    
    expect(wrapper.exists()).toBe(true);
  });


});

describe('Pricing Validation', () => {
  // eslint-disable-next-line no-undef
  const wrapper = shallow(<App />)
  it('should properly calculate base cost given number of nights and base price per the respective listing', () => {
    
  });
  
  it('should display pricing screen after calculating the total base cost', () => {
    
  });

  it('should properly calculate the aggregate extra guest fee given the number of guests and extra guest charge per the respective listing', () => {
    wrapper.setState({
      adults: 3,
      children: 2,
      extra_guest_cap: 2,
      extra_guest_charge: 100,
      selectedCheckIn: '2019-07-01',
      selectedCheckOut: '2019-07-05',
    });
    let calculatedFee = 4 * 3 * 100;
    wrapper.instance().calculateExtraGuests();

    expect(wrapper.state('extraGuestFee')).toBe(calculatedFee);
  });

});

describe('Display of Components', () => {
  const wrapper = mount(<App />);

  it('guest bar should be hidden, when displayGuest state property is false', () => {
    wrapper.setState({
      showGuest: true,
    });

    let display = wrapper.find('#overlay-guest');
    // finish this test
  });

  it('should hide calendar when hideCalendar is called', () => {
    const instance = wrapper.instance();
    wrapper.setState({
      showCalendar: true,
      view: 'out',
    });
    instance.hideCalendar();

    expect(wrapper.state('showCalendar')).toBe(false);
    expect(wrapper.state('view')).toBe(null);
  });

  it('should change the view of the calendar and display status when changeView is called', () => {
    const instance = wrapper.instance();
    wrapper.setState({
      view: 'in',
    });

    instance.changeView({
      target: 'out',
    });

    expect(wrapper.state('view')).toBe('out');
  })

  // it ('should change the view property when calendar is clicked', () => {
  // const wrapper = shallow(<App />);

  // let checkOut = wrapper.find('.date-checkout-text').childAt(0);
  // checkOut.simulate('click', {
  //   target: {
  //     name: 'view',
  //   },
  // });

  // expect(wrapper.state('view')).toBe('out');
});

describe('Accepting selected guest options', () => {
  // eslint-disable-next-line no-undef
  const wrapper = shallow(<App />);

  it('should set state for the appropriate guest type and number of guests, based on options passed in from child component', () => {
    const instance = wrapper.instance();
    const mockFn = jest.fn();
    instance.calculateExtraGuests = mockFn;

    instance.getSelectedGuests('adults', 5);
    expect(wrapper.state('adults')).toBe(5);

    instance.getSelectedGuests('children', 10);
    expect(wrapper.state('children')).toBe(10);

    instance.getSelectedGuests('infants', 20);
    expect(wrapper.state('infants')).toBe(20);
  });
});

describe('Accepting and Clearing Dates', () => {
  const wrapper = shallow(<App />);
  it('should change state for selected dates based on passed in parameters', () => {

    wrapper.setState({
      view: 'in',
    });
      
    const instance = wrapper.instance();
    instance.validateStay = jest.fn();

    instance.getSelectedDates('01-01-2019');
    expect(wrapper.state('selectedCheckIn')).toBe('01-01-2019');

    wrapper.setState({
      view: 'out',
    });

    instance.getSelectedDates('12-31-2019');
    expect(wrapper.state('selectedCheckOut')).toBe('12-31-2019');
  });

  it('should clear dates from state when clearSelectedDates is called', () => {
    wrapper.setState({
      selectedCheckIn: '05-25-2019',
      selectedCheckOut: '06-30-2019',
      displayPricing: true,
    });

    const instance = wrapper.instance();

    instance.clearSelectedDates();

    expect(wrapper.state('selectedCheckIn')).toBe(null);
    expect(wrapper.state('selectedCheckOut')).toBe(null);
    expect(wrapper.state('displayPricing')).toBe(false);
  });
});
