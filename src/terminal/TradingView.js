import React from 'react';
import { Col, Row } from 'reactstrap';

class TradingView extends React.Component {
  render() {
    return (
      <Col xs="12" className="price-chart chart">
        <div className="price-chart__top justify-content-between row col-12">
          <Row className="chart-controls align-items-center justify-content-between">
            <div className="control-resize"></div>
            <div className="control-dash"></div>
          </Row>
        </div>
        <div className="price-chart__graph row col-12">
        </div>
      </Col>
    );
  }
}

export default TradingView;
