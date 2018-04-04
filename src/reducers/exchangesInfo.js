import { GET_EXCHANGE_MARKETS, UPDATE_MARKET_SUMMARIES } from '../actions/terminal';
export const EXCHANGE_BITTREX = 'bittrex';
export default function(exchangesInfo = {}, action) {
  switch(action.type) {
    case GET_EXCHANGE_MARKETS: {
      const exchange = action.exchange;
      return {...exchangesInfo, [exchange]: {...exchangesInfo[exchange], markets: action.markets, marketNames: action.marketNames}};
    }
    case UPDATE_MARKET_SUMMARIES: {
      const summaries = action.summaries.map(market => {
        const currencies = market.MarketName.split('-');
        return {
          MarketCurrency: currencies[1],
          BaseCurrency: currencies[0],
          Price: market.Last,
          MarketName: market.MarketName,
          Volume: market.Volume,
          Change: market.Last / market.PrevDay * 100 - 100,
        };
      });
      return {...exchangesInfo, bittrex: {...exchangesInfo.bittrex, summaries}};
    }
    default:
      return exchangesInfo;
  }
}
