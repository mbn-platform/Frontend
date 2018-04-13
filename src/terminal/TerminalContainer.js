import Terminal from './Terminal';
import { connect } from 'react-redux';
import {
  selectMarket,
  selectExchange,
  selectInterval,
  selectApiKey,
  getExchangeMarkets,
} from '../actions/terminal';
import { WEBSOCKET_TERMINAL } from '../actions/websocket';

const mapStateToProps = state => ({
  ...state.terminal,
  orders: state.orders,
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
  selectApiKey: apiKey => dispatch(selectApiKey(apiKey)),
  connectToSocket: () => dispatch({
    type: WEBSOCKET_TERMINAL,
  }),
  getExchangeMarkets: exchange => dispatch(getExchangeMarkets(exchange)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Terminal);
