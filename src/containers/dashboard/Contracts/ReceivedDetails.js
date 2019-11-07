import React from 'react';
import { FormattedMessage } from 'react-intl';

const ReceivedDetails = () => (
  <div className="received-balances-table-wrapper table">
    <div className="table_title_wrapper">
      <div className="table_title">
        <FormattedMessage id="dashboard.balances" />
      </div>
    </div>
  </div>
);

export default ReceivedDetails;
