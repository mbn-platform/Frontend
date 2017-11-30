import React from 'react';
import { Col, Row } from 'reactstrap';

class MarketDepth extends React.Component {
  render() {
    return (
      <Col xs="12" className="marketdepth-chart chart">
        <Row className="chart__top justify-content-between">
          <div className="chart-controls align-items-center justify-content-between row">
            <div className="control-resize"></div>
            <div className="control-dash"></div>
          </div>
        </Row>
        <div className="marketdepth-chart__graph row col-12">
        </div>
      </Col>
    );
  }
}

export default MarketDepth;
