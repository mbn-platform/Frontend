import React from 'react';
import { FormattedMessage } from 'react-intl';

class ProfileChart extends React.Component {
  render() {
    return (
      <h2>
        <FormattedMessage
          id="profile.chart"
          defaultMessage="Chart"
        />
      </h2>
    );
  }
}

export default ProfileChart;
