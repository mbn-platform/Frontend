import React from 'react';
import Feedback from '../../components/Feedback';

class ProfileFeedbacks extends React.Component {
  render() {
    return (
      <div className="feedback-profile">
        <div className="profile-item container-fluid">
          <div className="table-screen">
            <div className="table-row">
              <Feedback
                comments={this.props.comments.map(c => ({
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
  }
}

export default ProfileFeedbacks;
