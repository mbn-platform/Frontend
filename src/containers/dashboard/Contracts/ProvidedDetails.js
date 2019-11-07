import React from 'react';
import { FormattedMessage } from 'react-intl';

const ProvidedDetails = () => (
  <div className="provided-balances-table-wrapper table">
    <div className="table_title_wrapper">
      <div className="table_title">
        <FormattedMessage id="dashboard.balances" />
      </div>
    </div>
  </div>
);

export default ProvidedDetails;
