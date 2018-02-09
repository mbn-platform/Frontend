import React from 'react';
import './LoginStep.css';
import { Container, Row, Col } from 'reactstrap';

const LoginStep = ({ onClick, hasActiveAccount, onNetSelect, isMainNet }) => {
  return hasActiveAccount ? (
    <MetamaskAccountActive
      onClick={onClick}
      onNetSelect={onNetSelect}
      isMainNet={isMainNet}
    />
  ) : <MetamaskAccountNotActive />;
};

const MetamaskAccountNotActive = () => (
  <div className="login_step_login">
    <div className="login_step_login_text">Please login into your Metamask account or check demo version.</div>
  </div>
);

const MetamaskAccountActive = ({ onClick, onNetSelect, isMainNet }) => (
  <div className="login_step_login">
    <div className="login_step_login_text">Please click the login button and button sign to reach dashboard:</div>
    <NetSelector
      onNetSelect={onNetSelect}
      isMainNet={isMainNet}
    />
    <div className="login_step_login_field_wrapper clearfix">
      <input className="login_step_login_submit" type="submit" onClick={onClick} value="Login" />
    </div>
  </div>
);


const NetSelector = ({ onNetSelect, isMainNet }) => (
  <Container fluid className="switch">
    <Row>
      <Col xs="4" className="net-name" align="center">
        Testnet (Ropsten)
      </Col>
      <Col xs="4" align="center">
        <input className="cmn-toggle cmn-toggle-round-flat" type="checkbox" onChange={onNetSelect} checked={isMainNet}/>
        <label onClick={onNetSelect} className="cmn-toggle-background"/>
      </Col>
      <Col xs="4" className="net-name" align="center">
        Mainnet
      </Col>
    </Row>
  </Container>
);
export default LoginStep;
