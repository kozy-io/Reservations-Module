import React from 'react';
import { shallow } from 'enzyme';
import Calendar from '../Calendar';


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
    const days = wrapper.find('td.week-days-active-normal');
    const reserved =wrapper.find('td.week-days-disabled-normal');
    expect(days.length + reserved.length).toBe(numOfDays);
  });

  it('should disable pointers (click functionality) for dates that are in the past', () => {

  });

  it('should disable pointers (click functionality) for dates that are reserved (based on the listing displayed)', () => {

  });

});

describe('Calendar Functionality', () => {

  // eslint-disable-next-line no-undef
  it('clearing the calendar should reset all previously selected dates, and revert to the initial view', () => {

  });

  it('clicking on a check-in date with an invalid check-out date should render all days disabled', () => {

  });

  it('clicking on a check-out date with an invalid check-in date should render all days disabled', () => {

  });

});

