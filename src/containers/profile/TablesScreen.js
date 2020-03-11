import React from 'react';
import { Col, Row } from 'reactstrap';

import ProfitChart from './ProfitChart';
import BalanceChart from './BalanceChart';
import TradeHistory from './TradeHistory';

const TablesScreen = ({ getBalanceChart, profile }) => (
  <Col xs="12" sm="12" md className="item-screen table-screen">
    <Row>
      <Col xs="12">
        <BalanceChart
          getBalanceChart={getBalanceChart}
          name={profile.name} />
      </Col>
    </Row>
    <Row className="d-none d-md-block">
      <Col xs="12" className="gap-card" />
    </Row>
    <Row className="table-row">
      <Col xs="12">
        <ProfitChart
          stats={profile.stats || []}
          summary={profile.summary}
        />
      </Col>
    </Row>
    <Row className="d-none d-md-block">
      <Col xs="12" className="gap-card" />
    </Row>
    <Row className="table-row">
      <TradeHistory trades={profile.trades || []} />
    </Row>
  </Col>
);

export default TablesScreen;
