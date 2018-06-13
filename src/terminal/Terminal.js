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
import MediaQuery from 'react-responsive';
import {setFundId} from '../generic/util';

class Terminal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {fullScreenEnabled: false};
    this.onOrderSelect = this.onOrderSelect.bind(this);
    this.onFullScreenChange = this.onFullScreenChange.bind(this);
  }

  onOrderSelect(price, size, type) {
    this.setState({price, size, type: type || this.state.type});
  }

  onFullScreenChange(value) {
    this.setState({fullScreenEnabled: value});
  }

  allowedApiKeys(apiKeys, contracts) {
    const allowedOwnKeys = apiKeys.ownKeys.filter(k => k.state === 'FREE');
    const allowedReceivedKeys = apiKeys.receivedKeys.filter(k => {
      const contract = contracts.find(c => c.keyId === k._id);
      return !!contract;
    });
    return allowedOwnKeys.concat(allowedReceivedKeys);
  }

  componentWillReceiveProps(props) {
    if(props.fund && ((!this.props.fund || this.props.fund._id !== props.fund._id) ||
      props.market !== this.props.market)) {
      let payload = {
        symbol: props.market
      }
      payload = setFundId(payload, props.fund);
      this.props.getOrders(payload);
    }
  }

  render() {
    return (
      <Container fluid className="terminal">
        <Row>
          <Col xs="12" sm="12" md="12" lg="12" className="terminal-container">
            <HeaderStatus
              {...this.props.exchangeInfo}
            />
            <div className="terminal-main">
              <Controls
                market={this.props.market}
                fund={this.props.fund}
                userId={this.props.userId}
                exchange={this.props.exchange}
                exchanges={this.props.exchanges}
                apiKeys={this.props.apiKeys.ownKeys}
                contracts={this.props.contracts.current}
                onExchangeSelect={this.props.selectExchange}
                onApiKeySelect={this.props.selectFund}
                isFullScreenEnabled={this.state.fullScreenEnabled}
              />
              <Row className="charts">
                <Col xs="12" sm="12" md="6" lg="8" className="charts__left">
                  <TradingView
                    onFullScreenChange={this.onFullScreenChange}
                  />
                  <MarketDepth
                    market={this.props.market}
                    {...this.props.orderBook}
                  />
                  <Row className="justify-content-between">
                    <PlaceOrder
                      exchange={this.props.exchange}
                      price={this.state.price}
                      type={this.state.type}
                      size={this.state.size}
                      markets={(this.props.exchangeInfo || {}).markets || []}
                      ticker={this.props.ticker || {}}
                      placeOrder={this.props.placeOrder}
                      fund={this.props.fund}
                      market={this.props.market}
                    />
                    <MediaQuery query="(min-width: 576px)">
                      <MyOrders
                        market={this.props.market}
                        orders={this.props.orders}
                        cancelOrder={this.props.cancelOrder}
                      />
                    </MediaQuery>
                    <MediaQuery query="(max-width: 575px)">
                      <OrderBook
                        onOrderSelect={this.onOrderSelect}
                        orderBook={this.props.orderBook}
                        market={this.props.market}
                        exchange={this.props.exchange}
                        ticker={this.props.ticker || {}}
                      />
                    </MediaQuery>
                  </Row>
                </Col>
                <Col xs="12" sm="12" md="6" lg="4" className="charts__right">
                  <Row>
                    <MediaQuery query="(min-width: 576px)">
                      <OrderBook
                        onOrderSelect={this.onOrderSelect}
                        orderBook={this.props.orderBook}
                        exchange={this.props.exchange}
                        ticker={this.props.ticker || {}}
                        market={this.props.market}
                      />
                    </MediaQuery>
                    <MediaQuery query="(max-width: 575px)">
                      <MyOrders
                        market={this.props.market}
                        orders={this.props.orders}
                        cancelOrder={this.props.cancelOrder}
                      />
                    </MediaQuery>
                    <RecentTrades
                      market={this.props.market}
                      history={this.props.history}
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
    const savedExchange = localStorage.getItem('terminal.selectedExchange');
    if (savedExchange) {
      this.props.selectExchange(JSON.parse(savedExchange));
    } else if(this.props.exchange) {
      this.props.selectExchange(this.props.exchange);
    }
    const savedFund = localStorage.getItem('terminal.selectedFund');
    if (savedFund) {
      this.props.selectFund(JSON.parse(savedFund));
    }
    const savedMarket = localStorage.getItem('terminal.selectedMarket');
    if (savedMarket) {
      this.props.selectMarket(savedMarket);
    }
    const savedInterval = localStorage.getItem('terminal.selectedInterval');
    if (savedInterval) {
      this.props.selectInterval(JSON.parse(savedInterval));
    }
  }


  componentWillUnmount() {
    window.uncustomize();
  }
}

export default Terminal;
