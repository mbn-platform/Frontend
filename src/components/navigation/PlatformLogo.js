import React from 'react';
import { Col, Row, Container } from 'reactstrap';
import Logo from '../../assets/svg/MainLogo.svg';

export class PlatformLogo extends React.PureComponent {
  render() {
    return (
      <a target="_blank" href="https://membrana.io" rel='noopener noreferrer' className="nav-link d-none d-md-flex">
        <Container fluid className="h-100">
          <Row className="h-100">
            <Col xs="12" className="align-self-center">
              <Container fluid className="align-middle">
                <Row className="d-flex justify-content-center">
                  <img className="cursor-pointer" src={Logo} width="36" height="36" alt="" />
                </Row>
              </Container>
            </Col>
          </Row>
        </Container>
      </a>
    );
  }
}
