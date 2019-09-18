import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { UncontrolledTooltip } from 'reactstrap';
import { FormattedMessage } from 'react-intl';

const LockButton = ({
  children,
  offsetTop,
  offsetBottom,
  offsetLeft,
  offsetRight,
  disabled,
}) => (
  <div style={{ position: 'relative' }}>
    <NavLink to="/tariffs" id="need-to-upgrade-plan">
      <button
        type="button"
        style={{
          color: 'red', // temporary
          position: 'absolute',
          top: {offsetTop},
          bottom: {offsetBottom},
          left: {offsetLeft},
          right: {offsetRight},
        }}
      >
        Icon
      </button>
    </NavLink>
    <UncontrolledTooltip target="need-to-upgrade-plan">
      <FormattedMessage id="profile.needToUpgradePlan" />
    </UncontrolledTooltip>
    <div>
      {React.Children.map(children, child => (
        React.cloneElement(child, {
          disabled,
        })
      ))}
    </div>
  </div>
);

LockButton.defaultProps = {
  children: null,
  offsetTop: '0',
  offsetBottom: '0',
  offsetLeft: '0',
  offsetRight: '0',
  disabled: true,
};

LockButton.propTypes = {
  children: PropTypes.node,
  offsetTop: PropTypes.string,
  offsetBottom: PropTypes.string,
  offsetLeft: PropTypes.string,
  offsetRight: PropTypes.string,
  disabled: PropTypes.bool,
};

export default LockButton;
