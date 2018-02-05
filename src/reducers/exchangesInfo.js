import { GET_EXCHANGE_MARKETS } from '../actions/terminal';
export const EXCHANGE_BITTREX = 'bittrex';
export default function(exchangesInfo = {}, action) {
  switch(action.type) {
    case GET_EXCHANGE_MARKETS: {
      const exchange = action.exchange;
      return {...exchangesInfo, [exchange]: {...exchangesInfo[exchange], markets: action.markets}};
    }
    default:
      return exchangesInfo;
  }
}
