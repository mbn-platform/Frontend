import React from 'react';
import { Row, Container, Col } from 'reactstrap';
import { FormattedMessage } from 'react-intl';

const ContractSent = () => (
  <Row className="row-fluid contract-sent-block">
    <Container fluid>
      <Row className="justify-content-center contract-sent-title">
        <Col xs="auto" className="text-center align-middle contract-sent-title-text title-text">
          <FormattedMessage
            id="profile.contractDetails"
            defaultMessage="contract details"
          />
        </Col>
      </Row>
      <Row className="justify-content-center request-sent">
        <Col xs="12" className="text-center align-middle request-sent-title-text">
          <FormattedMessage
            id="profile.requestHasBeenSent"
            defaultMessage="Your request has been sent!"
          />
        </Col>
        <Col className="text-center align-middle request-sent-answer-text">
          <FormattedMessage
            id="profile.willGetAnswer"
            defaultMessage="You will get an answer within 24h."
          />
        </Col>
      </Row>
      <Row>
        <Col className="d-flex justify-content-center gotit-btn-group">
          <button onClick={this.props.onButtonClick} type="button" className="gotit-btn cancel-btn btn btn-secondary active">
            <FormattedMessage
              id="profile.gotIt"
              defaultMessage="GOT IT"
            />
          </button>
        </Col>
      </Row>
    </Container>
  </Row>
);

export default ContractSent;
