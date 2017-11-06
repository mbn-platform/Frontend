import React from 'react';
import { Row, Container, Col } from 'reactstrap';

class ContractSent extends React.Component {

  render() {
    return (
      <Row className="row-fluid contract-sent-block">
        <Container fluid >
          <Row className="justify-content-center contract-sent-title">
            <Col xs="auto" className="text-center align-middle contract-sent-title-text title-text">
              contract details
            </Col>
          </Row>
          <Row className="justify-content-center request-sent">
            <Col xs="12" className="text-center align-middle request-sent-title-text">
              Your request has been sent!
            </Col>
            <Col className="text-center align-middle request-sent-answer-text">
              You will get an answer within 24h.
            </Col>
          </Row>
          <Row>
            <Col className="d-flex justify-content-center gotit-btn-group">
              <button onClick={this.props.onButtonClick} type="button" className="gotit-btn cancel-btn btn btn-secondary active">
                GOT IT
              </button>
            </Col>
          </Row>
        </Container>
      </Row>
    );
  }
}

export default ContractSent;
