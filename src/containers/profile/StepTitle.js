import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

const StepTitle = ({ step, count }) => (
  <div className="row-fluid choose-api-block">
    <div className="row justify-content-center profile-step-title">
      <FormattedMessage
        id="profile.steps"
        values={{ step, count }}
      />
    </div>
  </div>
);

StepTitle.propTypes = {
  step: PropTypes.number.isRequired,
  count: PropTypes.number.isRequired,
};

export default StepTitle;
