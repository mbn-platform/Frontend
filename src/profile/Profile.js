import React from 'react';
import ProfileInfo from './ProfileInfo';
import { Row, Container } from 'reactstrap';

class Profile extends React.Component {

  render() {
    return (
      <Container fluid>
        <Row>
          <ProfileInfo
            name="some_trader"
          />
        </Row>
      </Container>
    );
  }
}

export default Profile;
