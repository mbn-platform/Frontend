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
import { getOrderBook} from '../api/bittrex/bittrex';
import { connect } from 'react-redux';
import { selectApiKey, cancelOrder, selectMarket, placeOrder } from '../actions/terminal';
import MediaQuery from 'react-responsive';

class Terminal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {buy: [], sell: []}
  }


  updateOrderBook(market) {
    getOrderBook(this.props.selectedMarket, 'buy').then(json => {
      if(json.success) {
        let buy = json.result;
        buy.sort((b1,b2) => (b1.Rate - b2.Rate))
        getOrderBook(this.props.selectedMarket, 'sell').then(json => {
          if(json.success) {
            let sell = json.result;
            this.setState({buy: buy, sell: sell});
          }          
        }).catch(err => console.log('error updating order book', err));
      }
    }).catch(err => console.log('error updating order book', err));
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
                  <MarketDepth 
                    buy={this.state.buy}
                    sell={this.state.sell}                  
                    market={this.props.selectedMarket}
                  />
                  <Row className="justify-content-between">
                    <PlaceOrder                    
                      placeOrder={this.props.placeOrder}
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
                        buy={this.state.buy}
                        sell={this.state.sell}
                        market={this.props.selectedMarket}
                      />
                    </MediaQuery>
                  </Row>
                </Col>
                <Col xs="12" sm="12" md="6" lg="4">
                  <Row>
                    <MediaQuery query="(min-width: 576px)">
                      <OrderBook
                        buy={this.state.buy}
                        sell={this.state.sell}                      
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
    if(!this.props.selectedApiKey) {
      const key = this.props.apiKeys.ownKeys[0] || this.props.apiKeys.receivedKeys[0];
      this.props.selectApiKey(key);
    }
    this.interval = setInterval(this.updateOrderBook.bind(this), 5000);
    this.updateOrderBook();    
  }

  componentWillUnmount() {
    window.uncustomize();
    clearInterval(this.interval);
  }
}

const TerminalContainer = connect(state => ({
  apiKeys: state.apiKeys,
  selectedApiKey: state.terminal.selectedApiKey,
  selectedMarket: state.terminal.selectedMarket,
  orders: state.terminal.orders,
}), dispatch => ({
  placeOrder: order => dispatch(placeOrder(order)),
  selectApiKey: key => dispatch(selectApiKey(key)),
  cancelOrder: order => dispatch(cancelOrder(order)),
  selecteMarket: market => dispatch(selectMarket(market)),
}))(Terminal);
export default TerminalContainer;
