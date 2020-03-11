import React from 'react';

import Feedback from 'components/Feedback';

const ProfileFeedbacks = ({ comments }) => (
  <div className="feedback-profile">
    <div className="profile-item container-fluid">
      <div className="table-screen">
        <div className="table-row">
          <Feedback
            comments={comments.map(c => ({
              name: c.from.name,
              text: c.text,
              rate: c.rate,
              dt: c.dt,
            }))}
          />
        </div>
      </div>
    </div>
  </div>
);

export default ProfileFeedbacks;
