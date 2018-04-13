import {SELECT_API_KEY, SELECT_EXCHANGE, SELECT_MARKET,
  SELECT_INTERVAL, GET_MY_ORDERS, CANCEL_ORDER, PLACE_ORDER} from '../actions/terminal';
import {UPDATE_ORDER_BOOK, UPDATE_HISTORY, UPDATE_TICKER} from '../actions/terminal';
import {GET_API_KEYS} from '../actions/apiKeys';

export default function(state = {
  apiKey: null,
  exchange: 'bittrex',
  market: 'USDT-BTC',
  interval: '5m',
  orderBook: {sell: [], buy: [], smap: {}, bmap: {}},
  history: [],
  ticker: null,
  orders: {open: [], closed: []},
}, action) {
  switch(action.type) {
    case SELECT_API_KEY: {
      return {...state, apiKey: action.key};
    }
    case SELECT_MARKET: {
      if(action.market === state.market) {
        return state;
      } else {
        return {...state, market: action.market, orderBook: {sell: [], buy: [], smap: {}, bmap: {}}, history: []};
      }
    }
    case SELECT_EXCHANGE: {
      if(action.exchange === state.exchange) {
        return state;
      } else {
        return {...state, exchange: action.exchange, orderBook: {sell: [], buy: [], smap: {}, bmap: {}}, history: []};
      }
    }
    case SELECT_INTERVAL: {
      if(action.interval === state.interval) {
        return state;
      } else {
        return {...state, interval: action.interval};
      }
    }
    case UPDATE_ORDER_BOOK: {
      if(!(action.market === state.market && action.exchange === state.exchange)) {
        return state;
      }
      const smap = {...state.orderBook.smap};
      for(const o of action.orderBook.sell) {
        const [value, amount] = o;
        if(amount === 0) {
          delete smap[value];
        } else {
          smap[value] = {Quantity: amount, Rate: value};
        }
      }
      const bmap = {...state.orderBook.bmap};
      for(const o of action.orderBook.buy) {
        const [value, amount] = o;
        if(amount === 0) {
          delete bmap[value];
        } else {
          bmap[value] = {Quantity: amount, Rate: value};
        }
      }
      const buy = Object.values(bmap).sort((o1, o2) => o2.Rate - o1.Rate);
      const sell = Object.values(smap).sort((o1, o2) => o1.Rate - o2.Rate);
      const maxBuy = buy.reduce((accum, value) => Math.max(accum, value.Quantity * value.Rate), 0);
      const maxSell = sell.reduce((accum, value) => Math.max(accum, value.Quantity * value.Rate), 0);
      const minBuy = buy.reduce((accum, value) => Math.min(accum, value.Quantity * value.Rate), maxBuy);
      const minSell = sell.reduce((accum, value) => Math.min(accum, value.Quantity * value.Rate), maxSell);
      return {...state, orderBook: {
        maxBuy, minBuy, maxSell, minSell,
        buy,
        sell,
        smap, bmap}};
    }
    case UPDATE_HISTORY: {
      if(!(action.market === state.market && action.exchange === state.exchange)) {
        return state;
      }
      const history = action.history.map(t => ({
        id: Math.random().toFixed(8),
        price: t[0],
        amount: t[1],
        type: t[3],
        dt: t[2],
      }));
      return {...state, history: history.concat(state.history).slice(0, 50)};
    }
    case UPDATE_TICKER: {
      if(action.exchange === state.exchange && action.market === state.market) {
        return {...state, ticker: action.ticker};
      }
      return state;
    }
    case GET_API_KEYS: {
      if(!state.apiKey && action.apiKeys.own.length) {
        return {...state, apiKey: action.apiKeys.own[0]};
      }
      break;
    }
    case GET_MY_ORDERS: {
      if(state.apiKey && state.apiKey._id === action.keyId) {
        return {...state, orders: action.orders};
      }
      break;
    }
    case PLACE_ORDER: {
      const orders = {
        open: state.orders.open.concat(action.order),
        closed: state.orders.closed,
      };
      return {...state, orders};
    }
    case CANCEL_ORDER: {
      const order = state.orders.open.find(o => o._id === action.order._id);
      if(order) {
        const orders = {
          open: state.orders.open.filter(o => o._id !== action.order._id),
          closed: state.orders.closed.concat(action.order),
        };
        return {...state, orders};
      }
      break;
    }
    default:
      return state;
  }
}
