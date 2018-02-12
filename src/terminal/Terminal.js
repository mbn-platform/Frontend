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
import { selectApiKey, cancelOrder, selectMarket, placeOrder, getMyOrders,
  updateTicker, updateOrderBook, updateHistory, getExchangeMarkets } from '../actions/terminal';
import { fetchDashboardData } from '../actions/dashboard';
import MediaQuery from 'react-responsive';

class Terminal extends React.Component {

  allowedApiKeys(apiKeys, contracts) {
    const allowedOwnKeys = apiKeys.ownKeys.filter(k => k.state === 'FREE');
    const allowedReceivedKeys = apiKeys.receivedKeys.filter(k => {
      const contract = contracts.find(c => c.keyId === k._id);
      return !!contract;
    });
    return allowedOwnKeys.concat(allowedReceivedKeys);
  }

  componentWillReceiveProps(props) {
    if(props.selectedMarket !== this.props.selectedMarket) {
      const market = props.selectedMarket;
      clearTimeout(this.updatesTimeout);
      this.updateInfo(market)
      this.updatesTimeout = setTimeout(() => {
        this.loopUpdates(market);
      }, 5000);
    }
    if(props.selectedApiKey && (!this.props.selectedApiKey ||
      this.props.selectedApiKey._id !== props.selectedApiKey._id)) {
      this.props.getMyOrders(props.selectedApiKey);
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
                apiKeys={this.allowedApiKeys(this.props.apiKeys, this.props.contracts)}
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
                      exchangeInfo={this.props.exchangesInfo['bittrex']}
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
                <Col xs="12" sm="12" md="6" lg="4" className="charts__right">
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
    const market = this.props.selectedMarket;
    this.updateInfo(market);
    this.updatesTimeout = setTimeout(() => {
      this.loopUpdates(market);
    }, 5000);
    this.keysUpdatesTimeout = setInterval(() => this.props.fetchDashboardData(), 5000);
    this.props.fetchDashboardData();
    const exchangeInfo = this.props.exchangesInfo.bittrex;
    if(!exchangeInfo || !exchangeInfo.markets) {
      this.props.getExchangeMarkets('bittrex');
    }
  }

  updateInfo(market) {
    this.props.updateOrderBook(market);
    this.props.updateTicker(market);
    this.props.updateHistory(market);
    if(this.props.selectedApiKey) {
      this.props.getMyOrders(this.props.selectedApiKey);
    }
  }

  loopUpdates(market) {
    this.props.updateTicker(market);
    this.updatesTimeout = setTimeout(() => {

      this.props.updateOrderBook(market);
      if(this.props.selectedApiKey) {
        this.props.getMyOrders(this.props.selectedApiKey);
      }
      this.updatesTimeout = setTimeout(() => {

        this.props.updateHistory(market);
        this.updatesTimeout = setTimeout(() => this.loopUpdates(market), 3000);
      }, 3000);
    }, 3000);
  }

  componentWillUnmount() {
    window.uncustomize();
    clearTimeout(this.updatesTimeout);
    clearInterval(this.keysUpdatesTimeout);
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
  history: state.terminal.history,
  exchangesInfo: state.exchangesInfo,
}), dispatch => ({
  selectApiKey: key => dispatch(selectApiKey(key)),
  cancelOrder: order => dispatch(cancelOrder(order)),
  selectMarket: market => dispatch(selectMarket(market)),
  getMyOrders: key => dispatch(getMyOrders(key)),
  fetchDashboardData: () => dispatch(fetchDashboardData()),
  placeOrder: (order, type) => dispatch(placeOrder(order, type)),
  updateTicker: market => dispatch(updateTicker(market)),
  updateOrderBook: market => dispatch(updateOrderBook(market)),
  updateHistory: market => dispatch(updateHistory(market)),
  getExchangeMarkets: market => dispatch(getExchangeMarkets(market)),
}))(Terminal);
export default TerminalContainer;
