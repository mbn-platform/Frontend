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
  exchanges: state.exchangesInfo.exchanges || [],
  apiKeys: state.apiKeys,
  contracts: state.contracts,
  userId: state.auth.profile._id,
});

const mapDispatchToProps =  dispatch => ({
  selectMarket: market => dispatch(selectMarket(market)),
  selectExchange: (exchange, restore) => dispatch(selectExchange(exchange, restore)),
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
