import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import HeaderStatus from './HeaderStatus';
import { Popover, PopoverBody } from 'reactstrap';
import Controls from './Controls';
import TradingView from './TradingView';
import MarketDepth from './MarketDepth';
import PlaceOrder from './PlaceOrder';
import MyOrders from './MyOrders';
import RecentTrades from './RecentTrades';
import OrderBook from './OrderBook';
import { connect } from 'react-redux';

class Terminal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {market: 'USDT-BTC'};
    this.onMarketSelect = this.onMarketSelect.bind(this);
  }

  onMarketSelect(market) {
    this.setState({market});
  }

  render() {
    return (
      <Container fluid className="terminal">
        <Row>
          <Col xs="12" sm="12" md="12" lg="12">
            <HeaderStatus />
            <div className="terminal-main">
              <Controls
                onMarketSelect={this.onMarketSelect}
                market={this.state.market}
                apiKeys={[...this.props.apiKeys.ownKeys, ...this.props.apiKeys.receivedKeys]}
              />
              <Row className="charts">
                <Col xs="12" sm="12" md="6" lg="8" className="charts__left">
                  <TradingView />
                  <MarketDepth />
                  <Row className="justify-content-between">
                    <PlaceOrder
                      market="BTC-ETH"
                    />
                    <MyOrders />
                  </Row>
                </Col>
                <Col xs="12" sm="12" md="6" lg="4">
                  <Row>
                    <OrderBook
                      market="BTC-ETH"
                    />
                    <RecentTrades
                      market="BTC-ETH"
                    />
                  </Row>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  componentDidMount() {
    window.customize();
  }

  componentWillUnmount() {
    window.uncustomize();
  }
}

const TerminalContainer = connect(state => ({
  apiKeys: state.apiKeys,
}))(Terminal);
export default TerminalContainer;
