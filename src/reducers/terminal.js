import {
  SELECT_FUND, SELECT_EXCHANGE, SELECT_MARKET,
  SELECT_INTERVAL, GET_MY_ORDERS, CANCEL_ORDER, PLACE_ORDER, UPDATE_ORDER
} from '../actions/terminal';
import {UPDATE_ORDER_BOOK, UPDATE_HISTORY, UPDATE_TICKER} from '../actions/terminal';
import {UPDATE_KEYS} from '../actions/dashboard';
import {FETCH_CONTRACTS} from '../actions/contracts';

export default function(state = {
  fund: null,
  exchange: localStorage.getItem('terminal.selectedExchange') || 'binance',
  market: localStorage.getItem('terminal.selectedMarket') || 'USDT-BTC',
  interval: localStorage.getItem('terminal.selectedInterval') || '30 MIN',
  orderBook: {sell: [], buy: [], smap: {}, bmap: {}},
  history: [],
  ticker: {},
  orders: {open: [], closed: []},
}, action) {
  switch(action.type) {
    case SELECT_FUND: {
      return {...state, fund: action.fund};
    }
    case SELECT_MARKET: {
      if(action.market === state.market) {
        return state;
      } else {
        return {...state, market: action.market, orderBook: {sell: [], buy: [], smap: {}, bmap: {}}, history: [], ticker: null};
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
      const history = action.history
        .sort((t1, t2) => t2[2] - t1[2])
        .map(t => ({
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
    case UPDATE_KEYS: {
      if(!state.fund && action.data.length && action.data[0].exchange === state.exchange) {
        return {...state, fund: action.data[0]};
      }
      break;
    }
    case FETCH_CONTRACTS: {
      if(!state.fund) {
        const contract = action.contracts.current.find(c => c.to._id === action.userId && c.exchange === state.exchange);
        if(contract) {
          return {...state, fund: contract};
        }
      }
      break;
    }
    case GET_MY_ORDERS: {
      if(state.fund && state.fund._id === action.fundId) {
        return {...state, orders: action.orders};
      }
      break;
    }
    case PLACE_ORDER: {
      const order = state.orders.open.find(o => o._id === action.order._id);
      if(!order) {
        let closed = state.orders.closed;
        let opened = state.orders.open;
        if (action.order.state === 'CLOSED') {
          closed = [action.order, ...closed];
        } else {
          opened = [action.order, ...opened];
        }
        const orders = {
          open: opened,
          closed: closed,
        };
        return {...state, orders};
      } else {
        return state;
      }
    }
    case UPDATE_ORDER: {
      let { open, closed } = state.orders;
      const order = action.order;
      switch (order.state) {
        case 'OPEN': {
          const old = open.find((o) => o._id === order._id);
          if (old) {
            open = open.map((o) => o._id === order._id ? order : o);
          } else {
            open = [order, ...open];
          }
          break;
        }
        case 'CLOSED': {
          const old = closed.find((o) => o._id === order._id);
          const oldOpen = open.find((o) => o._id === order._id);
          if (old) {
            closed = closed.map((o) => o._id === order._id ? order: o);
          } else {
            closed = [order, ...closed];
          }
          if (oldOpen) {
            open = open.filter((o) => o._id !== order._id);
          }
          break;
        }
        default:
          return state;
      }
      return {...state, orders: { open, closed }};
    }
    case CANCEL_ORDER: {
      const order = state.orders.open.find(o => o._id === action.order._id);
      if(order) {
        const orders = {
          open: state.orders.open.filter(o => o._id !== action.order._id),
          closed: state.orders.closed,
        };
        if(order.filled > 0) {
          orders.closed = [action.order, ...state.orders.closed];
        }
        return {...state, orders};
      }
      break;
    }
    default:
      return state;
  }
  return state;
}
