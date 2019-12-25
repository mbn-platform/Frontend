import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

const ApiKeysEmpty = ({ history }) => {
  const redirect = () => {
    history.push('/dashboard');
  };

  return (
    <div className="col-12 d-flex flex-column align-items-center">
      <div className="api-keys-empty-title">
        <FormattedMessage id="profile.noApiKeys" />
      </div>
      <button onClick={redirect} type="button" className="go-to-dashboard-btn btn active">
        <FormattedMessage id="profile.goToDashboard" />
      </button>
    </div>
  );
};

ApiKeysEmpty.propTypes = {
  history: PropTypes.shape().isRequired,
};

export default withRouter(ApiKeysEmpty);
