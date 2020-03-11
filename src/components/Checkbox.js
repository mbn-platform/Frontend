import React from 'react';
import PropTypes from 'prop-types';
import { Col } from 'reactstrap';
import { is } from 'ramda';
import { FormattedMessage } from 'react-intl';

const Checkbox = ({ name, checked, title, onChange }) => (
  <Col className='checkbox' xs='auto'>
    <label>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange(name)}
      />
      {is(Object, title) ? <FormattedMessage {...title} /> : title}
    </label>
  </Col>
);

Checkbox.propTypes = {
  name: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape(),
  ]).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Checkbox;
