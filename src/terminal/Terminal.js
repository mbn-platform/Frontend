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
import { selectApiKey, cancelOrder, selectMarket, placeOrder, getMyOrders, updateTicker, updateOrderBook } from '../actions/terminal';
import { fetchDashboardData } from '../actions/dashboard';
import MediaQuery from 'react-responsive';

class Terminal extends React.Component {

  allowedApiKeys() {
    const allowedOwnKeys = this.props.apiKeys.ownKeys.filter(k => k.state === 'FREE');
    const allowedReceivedKeys = this.props.apiKeys.receivedKeys.filter(k => {
      const contract = this.props.contracts.find(c => c.keyId === k._id);
      return !!contract;
    });
    return allowedOwnKeys.concat(allowedReceivedKeys);
  }

  componentWillReceiveProps(props) {
    if(props.selectedMarket !== this.props.selectedMarket) {
      const market = props.selectedMarket;
      clearTimeout(this.updatesTimeout);
      this.loopUpdates(market);
      this.props.updateTicker(market);
      this.props.updateOrderBook(market);
    }
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
                apiKeys={this.allowedApiKeys()}
                selectedApiKey={this.props.selectedApiKey}
                onApiKeySelect={key => this.props.selectApiKey(key)}
                onMarketSelect={this.props.selectMarket}
              />
              <Row className="charts">
                <Col xs="12" sm="12" md="6" lg="8" className="charts__left">
                  <TradingView />
                  <MarketDepth 
                    buy={this.props.orderBook.buy}
                    sell={this.props.orderBook.sell}                  
                    market={this.props.selectedMarket}
                  />
                  <Row className="justify-content-between">
                    <PlaceOrder                    
                      ticker={this.props.ticker}
                      placeOrder={this.props.placeOrder}
                      selectedApiKey={this.props.selectedApiKey}
                      market={this.props.selectedMarket}
                    />
                    <MediaQuery query="(min-width: 576px)">
                      <MyOrders
                        market={this.props.selectedMarket}
                        orders={this.props.orders}
                        cancelOrder={this.props.cancelOrder}
                      />
                    </MediaQuery>
                    <MediaQuery query="(max-width: 575px)">
                      <OrderBook
                        orderBook={this.props.orderBook}
                        ticker={this.props.ticker}
                        market={this.props.selectedMarket}
                      />
                    </MediaQuery>
                  </Row>
                </Col>
                <Col xs="12" sm="12" md="6" lg="4">
                  <Row>
                    <MediaQuery query="(min-width: 576px)">
                      <OrderBook
                        orderBook={this.props.orderBook}
                        ticker={this.props.ticker}
                        market={this.props.selectedMarket}
                      />
                    </MediaQuery>
                    <MediaQuery query="(max-width: 575px)">
                      <MyOrders
                        market={this.props.selectedMarket}
                        orders={this.props.orders}
                        cancelOrder={this.props.cancelOrder}
                      />
                    </MediaQuery>
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
    const allowed = this.allowedApiKeys();
    if(!this.props.selectedApiKey) {
      const key = allowed[0];
      this.props.selectApiKey(key);
    } else {
      const key = allowed.find(k => k._id === this.props.selectedApiKey._id);
      if(!key) {
        this.props.selectApiKey(null);
      }
    }
    this.props.fetchDashboardData();
    const market = this.props.selectedMarket;
    this.props.updateOrderBook(market);
    this.props.updateTicker(market);
    this.loopUpdates(market);
  }

  loopUpdates(market) {
    this.props.updateTicker(market);
    this.updatesTimeout = setTimeout(() => {
      this.props.updateOrderBook(market);
      this.updatesTimeout = setTimeout(() => this.loopUpdates(market), 3000);
    }, 3000);
  }

  updateTicker(market) {
    this.props.updateTicker(market);
    this.updateTimeout = setTimeout(() => this.updateTicker(market), 3000);
  }

  componentWillUnmount() {
    window.uncustomize();
    clearTimeout(this.updatesTimeout);
  }
}

const TerminalContainer = connect(state => ({
  apiKeys: state.apiKeys,
  contracts: state.contracts.current,
  selectedApiKey: state.terminal.selectedApiKey,
  selectedMarket: state.terminal.selectedMarket,
  orders: state.terminal.orders,
  ticker: state.terminal.ticker,
  orderBook: state.terminal.orderBook,
}), dispatch => ({
  selectApiKey: key => dispatch(selectApiKey(key)),
  cancelOrder: order => dispatch(cancelOrder(order)),
  selectMarket: market => dispatch(selectMarket(market)),
  getMyOrders: key => dispatch(getMyOrders(key)),
  fetchDashboardData: () => dispatch(fetchDashboardData()),
  placeOrder: (order, type) => dispatch(placeOrder(order, type)),
  updateTicker: market => dispatch(updateTicker(market)),
  updateOrderBook: market => dispatch(updateOrderBook(market)),
}))(Terminal);
export default TerminalContainer;
