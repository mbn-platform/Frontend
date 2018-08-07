import React from 'react';
import { FormattedMessage } from 'react-intl';

class ProfileComments extends React.Component {
  render() {
    return (
      <h2>
        <FormattedMessage
          id="profile.comments"
          defaultMessage="Comments"
        />
      </h2>
    );
  }
}

export default ProfileComments;
