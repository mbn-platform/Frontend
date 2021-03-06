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
  total,
  used,
  id,
  notifications,
  placement,
}) => {
  const styles = {
    button: {
      top: offsetTop,
      bottom: offsetBottom,
      left: offsetLeft,
      right: offsetRight,
    },
  };
  const isButtonLock = (used >= total && total !== -1) || !notifications;

  return isButtonLock ? (
    <div style={{ height: '100%' }} className="relative">
      <NavLink to="/tariffs">
        <div
          id={id}
          className="lock_button"
          style={styles.button}
        />
        <UncontrolledTooltip placement={placement} target={id}>
          <FormattedMessage id="profile.needToUpgradePlan" />
        </UncontrolledTooltip>
      </NavLink>
      {React.Children.map(children, child => (
        React.cloneElement(child, {
          disabled,
        })
      ))}
    </div>
  ) : children;
};

LockButton.defaultProps = {
  children: null,
  offsetTop: null,
  offsetBottom: null,
  offsetLeft: null,
  offsetRight: null,
  disabled: true,
  id: 'lock-button',
  notifications: true,
  used: undefined,
  total: undefined,
  placement: 'top',
};

LockButton.propTypes = {
  children: PropTypes.node,
  offsetTop: PropTypes.string,
  offsetBottom: PropTypes.string,
  offsetLeft: PropTypes.string,
  offsetRight: PropTypes.string,
  disabled: PropTypes.bool,
  notifications: PropTypes.bool,
  used: PropTypes.number,
  total: PropTypes.number,
  placement: PropTypes.string,
};

export default LockButton;
