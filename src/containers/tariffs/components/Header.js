import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Header = ({ label, active }) => (
  <div className="tariffs__header-container">
    <div className="tariffs__header-label">
      {label}
    </div>
  </div>
);

Header.defaultProps = {
  active: false,
};

Header.propTypes = {
  active: PropTypes.bool,
  label: PropTypes.string.isRequired,
};

export default Header;
