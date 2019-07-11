import React from 'react';
import { shallow } from 'enzyme';
import App from '../App';


// eslint-disable-next-line no-undef
describe('First React component test with Enzyme', () => {
  // eslint-disable-next-line no-undef
  it('renders without crashing', () => {
    const wrapper = shallow(<App />);    
    expect(wrapper.exists()).toBe(true);
  });

  
});