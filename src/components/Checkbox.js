import React from 'react';
import PropTypes from 'prop-types';
import { Col } from 'reactstrap';

const Checkbox = ({ checked, title, onToggle }) => {
  const onChange = () => {
    onToggle(!checked);
  };

  return (
    <Col className='checkbox' xs='auto'>
      <label>
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
        />
        {title}
      </label>
    </Col>
  );
};

Checkbox.propTypes = {
  checked: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default Checkbox;
