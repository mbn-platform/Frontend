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
  tariff,
}) => {
  const styles = {
    relative: {
      position: 'relative',
    },
    button: {
      color: 'red', // temporary
      position: 'absolute',
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      top: offsetTop,
      bottom: offsetBottom,
      left: offsetLeft,
      right: offsetRight,
      zIndex: '1',
    },
  };
  return tariff === 'free' ? (
    <div style={styles.relative}>
      <NavLink to="/tariffs" id="need-to-upgrade-plan">
        <button
          type="button"
          style={styles.button}
        >
          Lock
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
  tariff: PropTypes.string.isRequired,
};

export default LockButton;
