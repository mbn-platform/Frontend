import React from 'react';
import { Col, Row } from 'reactstrap';
import ProfitChart from './ProfitChart';
import BalanceChart from './BalanceChart';
import TradeHistory from './TradeHistory';

class TablesScreen extends React.Component {
  render() {
    return (
      <Col xs="12" sm="12" md className="item-screen table-screen">
        <Row>
          <Col xs="12">
            <BalanceChart
              getBalanceChart={this.props.getBalanceChart}
              name={this.props.profile.name}/>
          </Col>
        </Row>
        <Row className="d-none d-md-block">
          <Col xs="12" className="gap-card"/>
        </Row>
        <Row className="table-row">
          <Col xs="12">
            <ProfitChart
              stats={this.props.profile.stats || [] }
              summary={this.props.profile.summary}
            />
          </Col>
        </Row>
        <Row className="d-none d-md-block">
          <Col xs="12" className="gap-card"/>
        </Row>
        <Row className="table-row">
          <TradeHistory
            trades={this.props.profile.trades || []} />
        </Row>
      </Col>
    );
  }
}

export default TablesScreen;
