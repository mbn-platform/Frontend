import React from 'react';
import '../styles/main.css';
import './ProfileFeedbacks.css';
import Feedback from '../profile/Feedback';

class ProfileFeedbacks extends React.Component {
  render() {
    return (
      <div className="feedback-profile">
        <div className="profile-item container-fluid">
          <div className="table-screen">
            <div className="table-row">
              <Feedback
                comments={this.props.comments}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProfileFeedbacks;
