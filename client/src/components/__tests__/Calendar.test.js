import React from 'react';
import { shallow } from 'enzyme';
import Calendar from '../Calendar';


// eslint-disable-next-line no-undef
describe('Calendar Structure', () => {

  // eslint-disable-next-line no-undef
  it('should generate a table with 7 days of the week', () => {
    const wrapper = shallow(<Calendar />);
    const table = wrapper.find('table');
    const tbody = table.find('tbody');
    const headers = tbody.find('th');

    // eslint-disable-next-line no-undef
    expect(headers).toHaveLength(7);
  });

  // eslint-disable-next-line no-undef
  it('should generate a table with number of days corresponding to the current month', () => {
    let currentMonth = new Date().getMonth();
    let numOfDays = new Date(2019, currentMonth + 1, 0).getDate();
    const wrapper = shallow(<Calendar />);
    const table = wrapper.find('table');
    const tbody = table.find('tbody');
    const days = tbody.find('td.week-days-active');

    // eslint-disable-next-line no-undef
    expect(days).toHaveLength(numOfDays);
  });
});
