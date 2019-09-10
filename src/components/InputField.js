import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';

const InputField = ({
  id,
  label,
  placeholder,
  disabled,
  intl,
  ...props,
}) => (
  <div>
    <label
      htmlFor={id}
      style={{
        margin: '5px 0 5px 0',
        color: '#bfbfc1',
        letterSpacing: '1px',
        fontSize: '11px'
      }}
    >
      {label && <FormattedMessage {...label} />}
    </label>
    <div>
      <input
        className="profile-settings"
        id={id}
        placeholder={placeholder ? intl.formatMessage(placeholder) : ''}
        {...props}
      />
    </div>
  </div>
);

InputField.defaultProps = {
  disabled: false,
  spellCheck: false,
  autoComplete: 'off',
};

InputField.propTypes = {
  disabled: PropTypes.bool,
  spellCheck: PropTypes.bool,
  autoComplete: PropTypes.string,
  label: PropTypes.shape({
    id: PropTypes.string.isRequired,
    values: PropTypes.shape(),
  }),
  placeholder: PropTypes.oneOfType([PropTypes.shape(), PropTypes.string]),
  intl: PropTypes.shape().isRequired,
};

export default injectIntl(InputField);
