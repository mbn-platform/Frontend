import { EXCHANGE_MARKETS, EXCHANGE_RATES, GET_EXCHANGE_MARKETS, UPDATE_MARKET_SUMMARIES } from '../actions/terminal';
import { UPDATE_EXCHANGES } from '../actions/exchanges';
export const EXCHANGE_BITTREX = 'bittrex';
export const EXCHANGE_CURRENCIES = 'EXCHANGE_CURRENCIES';
export default function(exchangesInfo = {}, action) {
  switch(action.type) {
    case EXCHANGE_CURRENCIES: {
      const currencies = action.currencies;
      return {...exchangesInfo, [action.exchange]: {...exchangesInfo[action.exchange], currencies}};
    }
    case EXCHANGE_MARKETS: {
      const exchange = {...exchangesInfo[action.exchange]};
      action.markets.forEach(m => {
        const [base, second] = m.symbol.split('-');
        m.base = base;
        m.second = second;
        m.change = m.last / m.prevDay * 100 - 100;
      });
      exchange.markets = action.markets;
      return {...exchangesInfo, [action.exchange]: exchange};
    }
    case EXCHANGE_RATES: {
      const exchange = exchangesInfo[action.exchange] || {};
      const rates = {...exchange.rates};
      action.rates.forEach(r => {
        rates[r[0]] = r[1];
      });
      return {...exchangesInfo, [action.exchange]: {...exchangesInfo[action.exchange], rates}};
    }
    case UPDATE_EXCHANGES: {
      return {...exchangesInfo, exchanges: action.exchanges};
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
