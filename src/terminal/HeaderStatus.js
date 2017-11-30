import React from 'react';
import { Container, Row, Col } from 'reactstrap';

class HeaderStatus extends React.Component {

  render() {
    return (
      <header className="header-status">
        <Container fluid className="h-100">
          <Row className="h-100 justify-content-between">
            <Rates />
            <Balance
              first={{name: 'BTC', value: 10.523}}
              second={{name: 'ETH', value: 222.523}}
            />
          </Row>
        </Container>
      </header>
    );
  }
}

const Rates = props => (
  <Col xs="8" sm="8" md="6" lg="6" xl="4" className="curses-wrap row">
    <Col sm="4" md="4" lg="4" xs="4" className="curses row h-100 align-items-center justify-content-between">
      <Col xs="auto" className="curses-name">BTC/USD</Col>
      <Col xs="auto" className="curses-val">2542.2</Col>
      <Col xs="auto" className="curses-change up">
        <span className="icon icon-dir icon-up-dir"> </span>
        6.94%
      </Col>
    </Col>
    <Col sm="4" md="4" lg="4" xs="4" className="curses row h-100 align-items-center justify-content-between">
      <Col xs="auto" className="curses-name">ETH/USD</Col>
      <Col xs="auto" className="curses-val">2542.2</Col>
      <Col xs="auto" className="curses-change down">
        <span className="icon icon-dir icon-down-dir"> </span>
        6.94%
      </Col>
    </Col>
    <Col sm="4" md="4" lg="4" xs="4" className="curses row h-100 align-items-center justify-content-between">
      <Col xs="auto" className="curses-name">BTC/ETH</Col>
      <Col xs="auto" className="curses-val">0.1102</Col>
      <Col xs="auto" className="curses-change up">
        <span className="icon icon-dir icon-up-dir"> </span>
        6.94%
      </Col>
    </Col>
  </Col>
);

const Balance = ({first, second}) => (
  <Col xs="4" sm="4" md="3" lg="3" xl="2" className="row justify-content-end align-items-center">
    <div className="balance-title"> BALANCE:</div>
    <div className="balance-wrap">
      <BalanceValue {...first} />
      <BalanceValue {...second} />
    </div>
  </Col>
);

const BalanceValue = ({name, value}) => (
  <Row className="balance justify-content-center align-items-center">
    <div className="balance-name">{name}</div>
    <div className="balance-val">{value}</div>
  </Row>
);

export default HeaderStatus;
