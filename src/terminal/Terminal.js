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

class Terminal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.onOrderSelect = this.onOrderSelect.bind(this);
  }

  onOrderSelect(price, size, type) {
    this.setState({price, size, type: type || this.state.type});
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
  }

  render() {
    return (
      <Container fluid className="terminal">
        <Row>
          <Col xs="12" sm="12" md="12" lg="12">
            <HeaderStatus
              {...this.props.exchangeInfo}
            />
            <div className="terminal-main">
              <Controls
                market={this.props.market}
                apiKey={this.props.apiKey}
                exchange={this.props.exchange}
                apiKeys={this.props.apiKeys.ownKeys.concat(this.props.apiKeys.receivedKeys)}
                onExchangeSelect={this.props.selectExchange}
                onApiKeySelect={this.props.selectApiKey}
              />
              <Row className="charts">
                <Col xs="12" sm="12" md="6" lg="8" className="charts__left">
                  <TradingView />
                  <MarketDepth
                    market={this.props.market}
                    {...this.props.orderBook}
                  />
                  <Row className="justify-content-between">
                    <PlaceOrder
                      price={this.state.price}
                      type={this.state.type}
                      size={this.state.size}
                      markets={(this.props.exchangeInfo || {}).markets || []}
                      ticker={this.props.ticker || {}}
                      placeOrder={this.props.placeOrder}
                      selectedApiKey={this.props.apiKey}
                      market={this.props.market}
                    />
                    <MediaQuery query="(min-width: 576px)">
                      <MyOrders
                        market={this.props.market}
                        orders={{open: [], completed: []}}
                        cancelOrder={this.props.cancelOrder}
                      />
                    </MediaQuery>
                    <MediaQuery query="(max-width: 575px)">
                      <OrderBook
                        onOrderSelect={this.onOrderSelect}
                        orderBook={this.props.orderBook}
                        market={this.props.market}
                        ticker={this.props.ticker}
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
                        ticker={this.props.ticker | {}}
                        market={this.props.market}
                      />
                    </MediaQuery>
                    <MediaQuery query="(max-width: 575px)">
                      <MyOrders
                        market={this.props.market}
                        orders={{open: [], completed: []}}
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
    this.props.connectToSocket();
    this.props.getExchangeMarkets(this.props.exchange);
  }


  componentWillUnmount() {
    window.uncustomize();
  }
}

export default Terminal;
