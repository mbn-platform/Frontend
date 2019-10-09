import React from 'react';
import { shallow } from 'enzyme';

import Header from '../Header';

describe('Header component matches snapshot', () => {
  const defaultProps = {
    label: 'Test label',
    active: false,
    selectable: false,
    onClick: jest.fn(),
  };

  it('with default props', () => {
    const wrapper = shallow(<Header {...defaultProps} />);

    expect(wrapper).toMatchSnapshot();
  });

  it('with `active` and `selectable` true', () => {
    const props = {
      ...defaultProps,
      active: true,
      selectable: true,
    };
    const wrapper = shallow(<Header {...props} />);

    expect(wrapper).toMatchSnapshot();
  });
});
