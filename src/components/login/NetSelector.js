import React from 'react';
import { Container, Row, Col } from 'reactstrap';

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

export default NetSelector;
