import React from 'react';
import { FormattedMessage } from 'react-intl';

class Groups extends React.Component {
  render = () => (
    <div className="groups-table-wrapper table">
      <div className="table_title_wrapper">
        <div className="table_title">
          <FormattedMessage id="dashboard.groups" />
        </div>
      </div>
    </div>
  );
}

export default Groups;
