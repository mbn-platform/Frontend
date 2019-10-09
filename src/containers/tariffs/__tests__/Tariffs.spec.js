import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';

import Tariffs from '../Tariffs';

describe('Tariffs component', () => {
  const store = configureStore()({});
  store.dispatch = jest.fn();
  const props = {
    loggedIn: false,
    billing: { tariff: 'free' },
    tariffs: [
      { _id: 'free' },
      { _id: 'premium' },
      { _id: 'pro' },
    ],
    fetchTariffs: jest.fn(),
    createPaymentRequest: jest.fn(),
    history: {
      push: jest.fn(),
    },
  };

  const container = shallow(<Tariffs {...props} />);
  const instance = container.instance();

  it('renders Tariffs component', () => {
    expect(container).toMatchSnapshot();
  });

  describe('onSelectTariff()', () => {
    const setStateSpy = jest.spyOn(instance, 'setState');
    const tariff = 'premium';

    it('when loggedIn === false', () => {
      instance.onSelectTariff(tariff)();
      expect(setStateSpy).not.toHaveBeenCalled();
    });

    it('when loggedIn === true', () => {
      container.setProps({ loggedIn: true });
      instance.onSelectTariff(tariff)();
      expect(setStateSpy).toHaveBeenCalled();
    });
  });


  it('componentDidMount()', () => {
    instance.componentDidMount();

    expect(instance.props.fetchTariffs).toHaveBeenCalled();
    expect(instance.props.fetchTariffs).toHaveBeenCalledTimes(2);
  });
});
