/* eslint-disable no-undef */
import React from 'react';
import { shallow, mount } from 'enzyme';
import Calendar from '../Calendar';
import Month from '../Month';
import moment from 'moment';
import axios from 'axios';


// eslint-disable-next-line no-undef
describe('Calendar Structure', () => {
  // eslint-disable-next-line no-undef
  it('should generate a table with 7 days of the week', () => {
    const wrapper = shallow(<Month />);
    const headers = wrapper.find('th');
    expect(headers).toHaveLength(7);
  });

  // eslint-disable-next-line no-undef
  it('should generate Date components corresponding to the number of days passed in from Month', () => {
    const mockFn = jest.fn();
    const num = 30;
    const wrapper = shallow(<Month daysInMonth={num} getStatus={mockFn} />);
    const days = wrapper.find('Date');
    expect(days.length).toBe(num);
  });

  it('clicking on the right arrow should invoke the function handleMonthChange with the correct direction', () => {
    const wrapper = shallow(<Calendar />);
    const instance = wrapper.instance();
    const mockFn = jest.fn();
    instance.handleMonthChange = mockFn;
    const arrow = wrapper.find('svg.svgRightArrow');
    arrow.simulate('click');
    const direction = mockFn.mock.calls[0][1];
    expect(direction).toBe('right');
  });

  it('clicking on the left arrow should invoke the function handleMonthChange with the correct direction', () => {
    const wrapper = shallow(<Calendar />);
    const instance = wrapper.instance();
    const mockFn = jest.fn();
    instance.handleMonthChange = mockFn;
    const arrow = wrapper.find('svg.svgLeftArrow');
    arrow.simulate('click');
    const direction = mockFn.mock.calls[0][1];
    expect(direction).toBe('left');
  });

  it('executing handleMonthChange from the right arrow should increment the current month', () => {
    const wrapper = shallow(<Calendar />);
    wrapper.setState({
      current: moment(),
    });

    const current = wrapper.state('current').month();

    const instance = wrapper.instance();
    instance.handleMonthChange({
      preventDefault: () => {},
    }, 'right');
    instance.handleMonthChange({
      preventDefault: () => {},
    }, 'right');

    const month = wrapper.state('current').month();
    expect(month).toBe(current + 2);
  });

  it('executing handleMonthChange from the left arrow should increment the current month', () => {
    const wrapper = shallow(<Calendar />);
    wrapper.setState({
      current: moment(),
    });

    const current = wrapper.state('current').month();

    const instance = wrapper.instance();
    instance.handleMonthChange({
      preventDefault: () => {},
    }, 'left');
    instance.handleMonthChange({
      preventDefault: () => {},
    }, 'left');

    const month = wrapper.state('current').month();
    expect(month).toBe(current - 2);
  });
});

describe('Disabled and Active Dates', () => {
  it('the getStatus function should return Disabled, when the date passed in is in the past', () => {
    const wrapper = shallow(<Calendar />);
    const instance = wrapper.instance();
    wrapper.setState({
      initial: moment(),
      current: moment(),
    });
    const pastDay = moment().subtract(1, 'day');
    const result = instance.getStatus(pastDay);

    expect(result).toBe('Disabled');
  });

  it('the getStatus function should return Disabled, when the date passed in is before the check in date', () => {
    const wrapper = shallow(<Calendar />);
    const instance = wrapper.instance();

    wrapper.setState({
      initial: moment(),
      current: moment(),
      selectCheckIn: moment('2019-07-15', 'YYYY-MM-DD'),
      selectCheckOut: null,
    });

    const date = 1; // representing July 1, before the check-in day
    const result = instance.getStatus(date);
    expect(result).toBe('Disabled');
  });

  it('the getStatus function should return Disabled, when the date passed in is after the check out date', () => {
    const wrapper = shallow(<Calendar />);
    const instance = wrapper.instance();

    wrapper.setState({
      initial: moment(),
      current: moment(),
      selectCheckIn: null,
      selectCheckOut: moment('2019-07-15', 'YYYY-MM-DD'),
    });

    const date = 31; // representing July 31, after the check out day
    const after = instance.getStatus(date);
    expect(after).toBe('Disabled');
  });


  it('if there is an invalid check-in or invalid check-out date, as maintained in state, getStatus should return Disabled', () => {
    const wrapper = shallow(<Calendar />);
    const instance = wrapper.instance();

    wrapper.setState({
      invalidCheckIn: true,
      invalidCheckOut: false,
    });

    const result = instance.getStatus(1);
    expect(result).toBe('Disabled');
  });

  it('when the check-in view is enabled, the getStatus function should return Disabled if the date passed in is reserved for check-in', () => {
    const wrapper = shallow(<Calendar view={'in'} />);
    const instance = wrapper.instance();

    const reserved = [1, 2, 3, 4, 5];

    wrapper.setState({
      current: moment('2019-07-15', 'YYYY-MM-DD'),
      initial: moment('2019-07-15', 'YYYY-MM-DD'),
      reserved,
      selectCheckIn: null,
      selectCheckOut: null,
    });

    const reservedOne = instance.getStatus(2);
    expect(reservedOne).toBe('Disabled');

    const reservedTwo = instance.getStatus(3);
    expect(reservedTwo).toBe('Disabled');

    const available = instance.getStatus(20);
    expect(available).toBe('Active');
  });

  it('when the check-out view is enabled, the getStatus function should return Disabled if the date passed in is reserved for check-out', () => {
    const view = 'out';
    const wrapper = shallow(<Calendar view={view} />);
    const instance = wrapper.instance();

    const reserved = [1, 5];

    wrapper.setState({
      current: moment('2019-07-15', 'YYYY-MM-DD'),
      initial: moment('2019-07-15', 'YYYY-MM-DD'),
      reserved: reserved,
      selectCheckIn: null,
      selectCheckOut: null,
    });

    const reservedOne = instance.getStatus(2);
    expect(reservedOne).toBe('Disabled');

    const reservedTwo = instance.getStatus(6);
    expect(reservedTwo).toBe('Disabled');

    const available = instance.getStatus(20);
    expect(available).toBe('Active');
  });
});

describe('Calendar Functionality', () => {
  it('clearing the calendar should reset all previously selected dates, and revert to the initial view', () => {
    const wrapper = shallow(<Calendar id={1} view={'in'} clearSelectedDates={() => {}} />);
    wrapper.instance().getReservedDates = jest.fn();

    let currentMonth = moment().month();

    const arrow = wrapper.find('svg.svgRightArrow');
    arrow.simulate('click');
    arrow.simulate('click');
    arrow.simulate('click');
    arrow.simulate('click');

    const clear = wrapper.find('.clear');
    clear.simulate('click', {
      preventDefault: () => {
      },
    });

    expect(wrapper.state().current.month()).toBe(currentMonth);
  });

  it('executing handleSelect should set selectCheckIn on state, if the current view is check-in, and validate the stay (passing in a callback function)', () => {
    const view = 'in';
    const mockGetSelectedDates = jest.fn();
    const mockValidateStay = jest.fn();
    const wrapper = shallow(<Calendar view={view} getSelectedDates={mockGetSelectedDates} />);
    const instance = wrapper.instance();
    instance.validateStay = mockValidateStay;

    const date = 1;

    wrapper.setState({
      current: moment(),
    });

    instance.handleSelect({
      preventDefault: () => {},
    }, date);

    const year = moment().year();
    const month = moment().month();
    const checkIn = moment(`${year}-${month+1}-${date}`, 'YYYY-MM-DD').format('YYYY-MM-DD');

    expect(wrapper.state('selectCheckIn').format('YYYY-MM-DD')).toBe(checkIn);
    expect(mockValidateStay).toBeCalled();
    expect(mockValidateStay.mock.calls.length).toBe(1);
  });

  it('executing handleSelect should set selectCheckOut on state, if the current view is check-out, and validate the stay (passing in a callback function)', () => {
    const view = 'out';
    const mockGetSelectedDates = jest.fn();
    const mockValidateStay = jest.fn();
    const wrapper = shallow(<Calendar view={view} getSelectedDates={mockGetSelectedDates} />);
    const instance = wrapper.instance();
    instance.validateStay = mockValidateStay;

    const date = 10;

    wrapper.setState({
      current: moment(),
    });

    instance.handleSelect({
      preventDefault: () => {},
    }, date);

    const year = moment().year();
    const month = moment().month();
    const checkOut = moment(`${year}-${month + 1}-${date}`, 'YYYY-MM-DD').format('YYYY-MM-DD');

    expect(wrapper.state('selectCheckOut').format('YYYY-MM-DD')).toBe(checkOut);
    expect(mockValidateStay).toBeCalled();
    expect(mockValidateStay.mock.calls.length).toBe(1);
  });

  it('should set invalidCheckIn to true, if check-out would overlap with a reserved date', () => {
    const minStay = 2;
    const view = 'in';
    const wrapper = shallow(<Calendar minStay={minStay} view={view} getSelectedDates={() => {}} />);
    const instance = wrapper.instance();

    wrapper.setState({
      reserved: [2],
    });

    instance.handleSelect({
      preventDefault: () => {},
    }, 1);

    expect(wrapper.state('invalidCheckIn')).toBe(true);
  });


  it('should set invalidCheckOut to true, if check-in would overlap with a reserved date', () => {
    const minStay = 2;
    const view = 'out';
    const wrapper = shallow(<Calendar minStay={minStay} view={view} getSelectedDates={() => {}} />);
    const instance = wrapper.instance();

    wrapper.setState({
      reserved: [2],
    });

    instance.handleSelect({
      preventDefault: () => {},
    }, 4);

    expect(wrapper.state('invalidCheckOut')).toBe(true);   
  });
});
