import React from 'react';
import { shallow } from 'enzyme';
import Calendar from '../Calendar';
import moment from 'moment';
import axios from 'axios';


// eslint-disable-next-line no-undef
describe('Calendar Structure', () => {
  // eslint-disable-next-line no-undef
  it('should generate a table with 7 days of the week', () => {
    const wrapper = shallow(<Calendar />);
    const headers = wrapper.find('th');


    // eslint-disable-next-line no-undef
    expect(headers).toHaveLength(7);
  });

  // eslint-disable-next-line no-undef
  it('should generate a table with number of days corresponding to the current month', () => {
    let currentMonth = new Date().getMonth();
    let numOfDays = new Date(2019, currentMonth + 1, 0).getDate();
    const wrapper = shallow(<Calendar />);
    wrapper.instance().getReservedDates = jest.fn();
    wrapper.update();

    const days = wrapper.find('td.week-days-active-normal');
    const reserved =wrapper.find('td.week-days-disabled-normal');
    expect(days.length + reserved.length).toBe(numOfDays);
  });

  it('should disable pointers (click functionality) for dates that are in the past', () => {
    let prevMo = moment().subtract(1, 'months');
    let prevMoDays = prevMo.daysInMonth();

    const wrapper = shallow(<Calendar />);
    wrapper.instance().getReservedDates = jest.fn();
    wrapper.update();

    const arrow = wrapper.find('svg.svg-left-arrow');
    arrow.simulate('click');
    const disabled = wrapper.find('td.week-days-disabled-normal');
    
    expect(disabled.length).toBe(prevMoDays);

  });

  it('should disable pointers (click functionality) for dates that are reserved (based on the listing displayed)', () => {
    const wrapper = shallow(<Calendar id={1} view={'in'} />);
    wrapper.instance().getReservedDates = jest.fn();
    wrapper.update();

    const mockReserveDates = [1, 2, 3, 4, 5];
    wrapper.setState({ reserved: mockReserveDates });

    const arrow = wrapper.find('svg.svg-right-arrow');
    arrow.simulate('click');

    const days = wrapper.find('td.week-days-disabled-normal');

    expect(days.length).toBe(mockReserveDates.length);
  });

  it('clicking on the right arrow should change the calendar month to the next month (and year if applicable)', () => {
    const wrapper = shallow(<Calendar />);
    wrapper.instance().getReservedDates = jest.fn();
    wrapper.update();

    const today = moment();
    const arrowMove = 10;

    const future = moment(today).add(arrowMove, 'months');
    const futureMonth = future.month();
    const futureYear = future.year();

    const arrow = wrapper.find('svg.svg-right-arrow');
    
    for (var i = 0; i < arrowMove; i++) {
      arrow.simulate('click');
    }

    expect(wrapper.state().currentMonth).toBe(futureMonth);
    expect(wrapper.state().currentYear).toBe(futureYear);

  });


  it('clicking on the left arrow should change the calendar month to the previous month (and year if applicable)', () => {
    const wrapper = shallow(<Calendar />);
    wrapper.instance().getReservedDates = jest.fn();
    wrapper.update();

    const today = moment();
    const arrowMove = 10;

    const past = moment(today).subtract(arrowMove, 'months');
    const pastMonth = past.month();
    const pastYear = past.year();

    const arrow = wrapper.find('svg.svg-left-arrow');
    
    for (var i = 0; i < arrowMove; i++) {
      arrow.simulate('click');
    }

    expect(wrapper.state().currentMonth).toBe(pastMonth);
    expect(wrapper.state().currentYear).toBe(pastYear);
  });


});

describe('Calendar Functionality', () => {
  it('clearing the calendar should reset all previously selected dates, and revert to the initial view', () => {
    const wrapper = shallow(<Calendar id={1} view={'in'} clearSelectedDates={() => {}} />);
    wrapper.instance().getReservedDates = jest.fn();
    wrapper.update();

    let currentMonth = moment().month();

    const arrow = wrapper.find('svg.svg-right-arrow');
    arrow.simulate('click');
    arrow.simulate('click');
    arrow.simulate('click');
    arrow.simulate('click');

    const clear = wrapper.find('button');
    clear.simulate('click', {
      preventDefault: () => {
      }
    });

    expect(wrapper.state().currentMonth).toBe(currentMonth);
  });

  it('clicking on a check-in date should render all previous dates disabled (to prevent check out before check in)', () => {
    const wrapper = shallow(<Calendar view={'in'} getSelectedDates={() => {}} />);
    wrapper.instance().getReservedDates = jest.fn();
    wrapper.update();

    const table = wrapper.find('td').last();
    table.simulate('click');

    let daysInMonth = moment().daysInMonth();

    let disabled = wrapper.find('td.week-days-disabled-normal');

    expect(disabled.length).toBe(daysInMonth - 1); // one item should be "selected" and not disabled.
  });

  it('clicking on a check-out date should render all future dates disabled (to prevent check in after check out)', () => {
    const wrapper = shallow(<Calendar view={'out'} getSelectedDates={() => {}} />);
    wrapper.instance().getReservedDates = jest.fn();
    wrapper.update();
    
    wrapper.setState({reserved: []});

    // go to next month (so no past days are interfering)
    const arrow = wrapper.find('svg.svg-right-arrow');
    arrow.simulate('click');
    
    // now, find cell 19 (arbitrary) and click it (nodes are indexed from 0)
    const table = wrapper.find('td.week-days-active-normal').at(18);
    table.simulate('click');
    
    // now, find the number of disabled cells which should be 20-31 (since we are in August) 
    let disabled = wrapper.find('td.week-days-disabled-normal');

    expect(disabled.length).toBe(12);
  });

});

