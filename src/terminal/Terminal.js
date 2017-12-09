import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import HeaderStatus from './HeaderStatus';
import Controls from './Controls';
import TradingView from './TradingView';
import MarketDepth from './MarketDepth';
import PlaceOrder from './PlaceOrder';
import MyOrders from './MyOrders';
import RecentTrades from './RecentTrades';
import OrderBook from './OrderBook';
import { connect } from 'react-redux';
import { selectApiKey, cancelOrder, selectMarket } from '../actions/terminal';
import { Desktop, Mobile } from '../generic/MediaQuery';

class Terminal extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Container fluid className="terminal">
        <Row>
          <Col xs="12" sm="12" md="12" lg="12">
            <HeaderStatus
              apiKey={this.props.selectedApiKey}
              market={this.props.selectedMarket}
            />
            <div className="terminal-main">
              <Controls
                market={this.props.selectedMarket}
                apiKeys={[...this.props.apiKeys.ownKeys, ...this.props.apiKeys.receivedKeys]}
                selectedApiKey={this.props.selectedApiKey}
                onApiKeySelect={key => this.props.selectApiKey(key)}
                onMarketSelect={this.props.selecteMarket}
              />
              <Row className="charts">
                <Col xs="12" sm="12" md="6" lg="8" className="charts__left">
                  <TradingView />
                  <MarketDepth />
                  <Row className="justify-content-between">
                    <PlaceOrder
                      market={this.props.selectedMarket}
                    />
                    <Desktop>
                      <MyOrders
                        orders={this.props.orders}
                        cancelOrder={this.props.cancelOrder}
                      />
                    </Desktop>
                    <Mobile>
                      <OrderBook
                        market={this.props.selectedMarket}
                      />
                    </Mobile>
                  </Row>
                </Col>
                <Col xs="12" sm="12" md="6" lg="4">
                  <Row>
                    <Desktop>
                      <OrderBook
                        market={this.props.selectedMarket}
                      />
                    </Desktop>
                    <Mobile>
                      <MyOrders
                        orders={this.props.orders}
                        cancelOrder={this.props.cancelOrder}
                      />
                    </Mobile>
                    <RecentTrades
                      market={this.props.selectedMarket}
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
    if(!this.props.selectedApiKey) {
      const key = this.props.apiKeys.ownKeys[0] || this.props.apiKeys.receivedKeys[0];
      this.props.selectApiKey(key);
    }
  }

  componentWillUnmount() {
    window.uncustomize();
  }
}

const TerminalContainer = connect(state => ({
  apiKeys: state.apiKeys,
  selectedApiKey: state.terminal.selectedApiKey,
  selectedMarket: state.terminal.selectedMarket,
  orders: state.terminal.orders,
}), dispatch => ({
  selectApiKey: key => dispatch(selectApiKey(key)),
  cancelOrder: order => dispatch(cancelOrder(order)),
  selecteMarket: market => dispatch(selectMarket(market)),
}))(Terminal);
export default TerminalContainer;
