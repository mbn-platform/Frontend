import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Header = ({ label, active, selectable, onClick }) => (
  <div className="tariffs__header-container">
    <div
      className={classNames('tariffs__header-label', {
        active, selectable,
      })}
      onClick={onClick}
    >
      {label.toUpperCase()}
    </div>
  </div>
);

Header.defaultProps = {
  active: false,
  selectable: false,
};

Header.propTypes = {
  active: PropTypes.bool,
  selectable: PropTypes.bool,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Header;
