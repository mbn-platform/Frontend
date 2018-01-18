import { UPDATE_EXCHANGE_RATES } from '../actions/terminal';

export default function rates(state = {USDT: {}, BTC: {}, ETH: {}}, action) {
  switch(action.type) {
    case UPDATE_EXCHANGE_RATES:
      return action.rates;
    default:
      return state;
  }
}
