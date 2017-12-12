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
import { selectApiKey } from '../actions/terminal';

class Terminal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      market: 'USDT-BTC',
    };
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
            <HeaderStatus
              apiKey={this.props.selectedApiKey}
              market={this.state.market}
            />
            <div className="terminal-main">
              <Controls
                market={this.state.market}
                apiKeys={[...this.props.apiKeys.ownKeys, ...this.props.apiKeys.receivedKeys]}
                selectedApiKey={this.props.selectedApiKey}
                onApiKeySelect={key => this.props.selectApiKey(key)}
                onMarketSelect={this.onMarketSelect}
              />
              <Row className="charts">
                <Col xs="12" sm="12" md="6" lg="8" className="charts__left">
                  <TradingView />
                  <MarketDepth />
                  <Row className="justify-content-between">
                    <PlaceOrder
                      market={this.state.market}
                    />
                    <MyOrders />
                  </Row>
                </Col>
                <Col xs="12" sm="12" md="6" lg="4">
                  <Row>
                    <OrderBook
                      market={this.state.market}
                    />
                    <RecentTrades
                      market={this.state.market}
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
}), dispatch => ({
  selectApiKey: key => dispatch(selectApiKey(key)),
}))(Terminal);
export default TerminalContainer;
