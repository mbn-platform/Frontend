import Terminal from './Terminal';
import { connect } from 'react-redux';
import {
  selectMarket,
  selectExchange,
  selectInterval,
  selectFund,
  placeOrder,
  getOrders,
  cancelOrder,
  getExchangeMarkets,
} from '../actions/terminal';
import { WEBSOCKET_TERMINAL } from '../actions/websocket';

const mapStateToProps = state => ({
  ...state.terminal,
  exchangeInfo: state.exchangesInfo[state.terminal.exchange],
  apiKeys: state.apiKeys,
});

const mapDispatchToProps =  dispatch => ({
  selectMarket: market => dispatch(selectMarket(market)),
  selectExchange: exchange => {
    dispatch(selectExchange(exchange));
    dispatch(getExchangeMarkets(exchange));
  },
  selectInterval: interval => dispatch(selectInterval(interval)),
  selectFund: fund => dispatch(selectFund(fund)),
  placeOrder: order => dispatch(placeOrder(order)),
  cancelOrder: order => dispatch(cancelOrder(order)),
  getOrders: apiKey => dispatch(getOrders(apiKey)),
  connectToSocket: () => dispatch({
    type: WEBSOCKET_TERMINAL,
  }),
  getExchangeMarkets: exchange => dispatch(getExchangeMarkets(exchange)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Terminal);
