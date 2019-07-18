import React from 'react';
import { Col, Row, Container } from 'reactstrap';
import ProfitChart from './ProfitChart';
import BalanceChart from './BalanceChart';
import TradeHistory from './TradeHistory';

class TablesScreen extends React.Component {
  render() {
    return (
      <Col xs="12" sm="12" md className="item-screen table-screen">
        <Container fluid className="h-100">
          <Row className="justify-content-center h-100">
            <Col xs="12" sm="12" md="12" lg="12" xl="12">
              <Container fluid className="h-custom-100">
                <Row className="table-row">
                  <BalanceChart
                    getBalanceChart={this.props.getBalanceChart}
                    name={this.props.profile.name}/>
                </Row>
                <Row className="d-none d-md-block">
                  <Col xs="12" className="gap-card"/>
                </Row>
                <Row className="table-row">
                  <ProfitChart stats={this.props.profile.stats || [] }
                    tradesAsInvestor={ [] }
                  />
                </Row>
                <Row className="d-none d-md-block">
                  <Col xs="12" className="gap-card"/>
                </Row>
                <Row className="table-row">
                  <TradeHistory
                    trades={this.props.profile.trades || []}
                  />
                </Row>
              </Container>
            </Col>
          </Row>
        </Container>
      </Col>
    );
  }
}

export default TablesScreen;
