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
}) => {
  const styles = {
    button: {
      top: offsetTop,
      bottom: offsetBottom,
      left: offsetLeft,
      right: offsetRight,
    },
  };
  const isButtonLock = used >= total && total !== -1;

  return isButtonLock ? (
    <div className="relative">
      <NavLink to="/tariffs" id="need-to-upgrade-plan">
        <div
          className="lock_button"
          style={styles.button}
        />
        <UncontrolledTooltip target="need-to-upgrade-plan">
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
};

LockButton.propTypes = {
  children: PropTypes.node,
  offsetTop: PropTypes.string,
  offsetBottom: PropTypes.string,
  offsetLeft: PropTypes.string,
  offsetRight: PropTypes.string,
  disabled: PropTypes.bool,
  used: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
};

export default LockButton;
