import React from 'react';
import PropTypes from 'prop-types';
import { Container, Col, Row } from 'reactstrap';
import SignOut from '../../assets/svg/SignOut.svg';
import SignOutHover from '../../assets/svg/SignOutHover.svg';

export class SignOutButton extends React.PureComponent {

  static propTypes = {
    loggedIn: PropTypes.bool,
    nameRequired: PropTypes.bool,
    logOut: PropTypes.func.isRequired,
  }

  onClick = (e) => {
    e.preventDefault();
    this.props.logOut();
  }

  render() {
    const { loggedIn, nameRequired } = this.props;
    if(!loggedIn && !nameRequired) {
      return null;
    }
    return (
      <a onClick={this.onClick} href="/" className="nav-link">
        <Container className="h-100 justify-content-center" fluid >
          <Row className="h-100">
            <Col xs="12" className="align-self-center">
              <Container fluid className="align-middle">
                <Row>
                  <Col xs="3" md="12" className="d-flex justify-content-end justify-content-md-center">
                    <img className='image_menu image' src={SignOut} alt=""/>
                    <img className='image_menu_hover image' src={SignOutHover} alt=""/>
                  </Col>
                  <Col xs="auto" className="d-flex d-md-none">
                    <div className="gap"/>
                  </Col>
                  <Col xs="3" md="12" className="d-flex justify-content-start justify-content-md-center">
                    <div className="menu-text">Sign out</div>
                  </Col>
                </Row>
              </Container>
            </Col>
          </Row>
        </Container>
      </a>
    );
  }
}
