import { reducerCreator } from 'generic/util';
import { EXCHANGE_MARKETS, EXCHANGE_RATES, UPDATE_MARKET_SUMMARIES, EXCHANGE_RATES_ALL } from 'actions/terminal';
import { UPDATE_EXCHANGES, EXCHANGE_CURRENCIES } from 'actions/exchanges';

const reducerList = {
  [EXCHANGE_CURRENCIES]: (state, { exchange, currencies }) => ({
    ...state, [exchange]: { ...state[exchange], currencies }
  }),
  [EXCHANGE_MARKETS]: (state, { exchange, markets }) => {
    const newExchange = { ...state[exchange] };
    markets.forEach(m => {
      const [base, second] = m.symbol.split('-');
      m.base = base;
      m.second = second;
      m.change = m.last / m.prevDay * 100 - 100;
    });
    newExchange.markets = markets;

    return { ...state, [exchange]: newExchange };
  },
  [EXCHANGE_RATES]: (state, { exchange, rates }) => {
    const newExchange = state[exchange] || {};
    const newRates = { ...newExchange.rates };
    rates.forEach(r => {
      newRates[r[0]] = r[1];
    });

    return { ...state, [exchange]: { ...state[exchange], rates: newRates }};
  },
  [EXCHANGE_RATES_ALL]: (state, { rates }) => {
    const exchanges = Object.keys(rates);
    for (const ex of exchanges) {
      const action = { type: EXCHANGE_RATES, exchange: ex, rates: rates[ex] };
      const reducer = reducerList[action.type];

      state = reducer(state, {
        type: EXCHANGE_RATES,
        exchange: ex,
        rates: rates[ex],
      });
    }

    return { ...state, exchanges };
  },
  [UPDATE_EXCHANGES]: (state, { exchanges }) => ({ ...state, exchanges }),
  [UPDATE_MARKET_SUMMARIES]: (state, { summaries }) => {
    const newSummaries = summaries.map(market => {
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

    return { ...state, bittrex: { ...state.bittrex, summaries: newSummaries }};
  },
};

export default reducerCreator({}, reducerList);
