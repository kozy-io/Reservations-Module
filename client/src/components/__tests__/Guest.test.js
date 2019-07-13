import React from 'react';
import { shallow } from 'enzyme';
import Guest from '../Guest';

// eslint-disable-next-line no-undef
describe.only('Guest Bar', () => {
  const wrapper = shallow(<Guest getSelectedGuests={()=>{}} maxGuests={5} />);

  it('should exist', () => {
    expect(wrapper.exists()).toBe(true);
  })

  // eslint-disable-next-line no-undef
  it('should generate three options with 2 buttons each', () => {
    const options = wrapper.find('button');
    // eslint-disable-next-line no-undef
    expect(options).toHaveLength(6);
  });

  it ('adult option should appear with a default value of 1', () => {
    let adult = wrapper.state().adult;
    expect(adult).toBe(1);
  });

  it ('clicking + should appropriately increment the guest count, respective to the option selected', () => {

    let adultPlus = wrapper.find('svg').at(1);
    let childPlus = wrapper.find('svg').at(3);
    let infantPlus = wrapper.find('svg').at(5);
    let simulations = 3;

    for (var i = 0; i < simulations; i++) {
      adultPlus.simulate('click', {
        preventDefault: () => {}
      });
      childPlus.simulate('click', {
        preventDefault: () => {}
      });
      infantPlus.simulate('click', {
        preventDefault: () => {}
      });
    }

    let adult = wrapper.state().adult;
    let child = wrapper.state().child;
    let infant = wrapper.state().infant;
  
    expect(adult).toBe(4);
    expect(child).toBe(3);
    expect(infant).toBe(3);
  });

  it ('clicking - should appropriately decrement the guest count, respective to the option selected', () => {
    wrapper.setState({
      adult: 10,
      child: 15,
      infant: 20,
    });
    
    const adultMinus = wrapper.find('svg').at(0);
    const childMinus = wrapper.find('svg').at(2);
    const infantMinus = wrapper.find('svg').at(4);
    const simulations = 4;

    for (let i = 0; i < simulations; i += 1) {
      adultMinus.simulate('click', {
        preventDefault: () => {},
      });
      childMinus.simulate('click', {
        preventDefault: () => {},
      });
      infantMinus.simulate('click', {
        preventDefault: () => {},
      });
    }

    const adult = wrapper.state().adult;
    const child = wrapper.state().child;
    const infant = wrapper.state().infant;

    expect(adult).toBe(6);
    expect(child).toBe(11);
    expect(infant).toBe(16);
  });

  it ('- button should disable, so that children and infants cannot decrement below 0', () => {
    wrapper.setState({
      child: 2,
      infant: 0,
      adult: 2,
    });

    let infant = wrapper.find('.buttonMinusInner').at(2).parent();
    expect(infant.hasClass('buttonMinusOuterDisabled')).toBe(true);

    wrapper.setState({
      child: 0,
      infant: 2,
      adult: 2,
    });

    let child = wrapper.find('.buttonMinusInner').at(1).parent();
    expect(child.hasClass('buttonMinusOuterDisabled')).toBe(true);

  });

  it ('- button should disable, so that adults should not decrement below 1', () => {
    wrapper.setState({
      adult: 1,
      child: 2,
      infant: 2,
    });

    let adult = wrapper.find('.buttonMinusInner').at(0).parent();
    expect(adult.hasClass('buttonMinusOuterDisabled')).toBe(true);
  });

  it ('+ button should disable when max guests are reached, so that adults and children cannot increment past the maximum guests allowed, respective to the listing', () => {
    wrapper.setState({
      adult: 4,
      child: 1,
      infant: 2,
    });

    let adult = wrapper.find('.buttonPlusInner').at(0).parent();
    let child = wrapper.find('.buttonPlusInner').at(1).parent();

    expect(adult.hasClass('buttonPlusOuterDisabled')).toBe(true);
    expect(child.hasClass('buttonPlusOuterDisabled')).toBe(true);
  });

  it ('infants should not increment past 5', () => {
    wrapper.setState({
      adult: 1,
      child: 0,
      infant: 5,
    });

    let infant = wrapper.find('.buttonPlusInner').at(2).parent();
    expect(infant.hasClass('buttonPlusOuterDisabled')).toBe(true);

  });
});
