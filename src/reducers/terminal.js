import { reducerCreator } from 'generic/util';
import * as actions from 'actions/terminal';
import { UPDATE_ASSET_GROUP, DELETE_ASSET_GROUP } from 'actions/assetGroup';

const initialState = {
  fundId: null,
  groupId: null,
  exchange: 'binance',
  market: 'USDT-BTC',
  interval: '30 MIN',
  orderBook: { sell: [], buy: [], smap: {}, bmap: {} },
  history: [],
  ticker: {},
  orders: { open: [], closed: [] },
  isValidUrl: undefined,
};

const reducerList = {
  [actions.SELECT_FUND]: (state, { fundId }) => ({ ...state, fundId }),
  [actions.SELECT_MARKET]: (state, { market }) => (
    market === state.market
      ? state
      : { ...state, market, orderBook: initialState.orderBook, history: [], ticker: null }
  ),
  [actions.SELECT_ASSET_GROUP]: (state, { groupId }) => ({
    ...state,
    groupId,
    orders: groupId ? state.orders : initialState.orders,
    fundId: null,
  }),
  [DELETE_ASSET_GROUP]: (state) => ({
    ...state,
    groupId: null,
    orders: state.groupId ? initialState.orders : state.orders,
  }),
  [UPDATE_ASSET_GROUP]: (state, { assetGroup }) => ({ ...state, groupId: assetGroup._id }),
  [actions.SELECT_EXCHANGE]: (state, { exchange }) => (
    exchange === state.exchange
      ? state
      : { ...state, exchange, orderBook: initialState.orderBook, history: [] }
  ),
  [actions.SELECT_INTERVAL]: (state, { interval }) => (
    interval === state.exchange ? state : { ...state, interval }
  ),
  [actions.UPDATE_ORDER_BOOK]: (state, { market, exchange, orderBook }) => {
    if (!(market === state.market && exchange === state.exchange)) { return state; }

    const newOrderBook = {...state.orderBook};
    if (orderBook.sell.length) {
      const newSmap = { ...state.orderBook.smap };
      for (const o of orderBook.sell) {
        const [value, amount] = o;
        if (amount === 0) {
          delete newSmap[value];
        } else {
          newSmap[value] = { Quantity: amount, Rate: value };
        }
      }
      const sell = Object.values(newSmap).sort((o1, o2) => o1.Rate - o2.Rate);
      const maxSell = sell.reduce((accum, value) => Math.max(accum, value.Quantity * value.Rate), 0);
      const minSell = sell.reduce((accum, value) => Math.min(accum, value.Quantity * value.Rate), maxSell);
      newOrderBook.smap = newSmap;
      newOrderBook.sell = sell;
      newOrderBook.maxSell = maxSell;
      newOrderBook.minSell = minSell;
    }

    if (orderBook.buy.length) {
      const newBmap = { ...state.orderBook.bmap };
      for(const o of orderBook.buy) {
        const [value, amount] = o;
        if(amount === 0) {
          delete newBmap[value];
        } else {
          newBmap[value] = {Quantity: amount, Rate: value};
        }
      }
      const buy = Object.values(newBmap).sort((o1, o2) => o2.Rate - o1.Rate);
      const maxBuy = buy.reduce((accum, value) => Math.max(accum, value.Quantity * value.Rate), 0);
      const minBuy = buy.reduce((accum, value) => Math.min(accum, value.Quantity * value.Rate), maxBuy);
      newOrderBook.bmap = newBmap;
      newOrderBook.buy = buy;
      newOrderBook.maxBuy = maxBuy;
      newOrderBook.minBuy = minBuy;
    }

    return { ...state, orderBook: newOrderBook };
  },
  [actions.UPDATE_HISTORY]: (state, { market, exchange, history }) => {
    if ((market !== state.market && exchange !== state.exchange)) { return state; }

    const newHistory = history
      .sort((t1, t2) => t2[2] - t1[2])
      .map(t => ({
        id: Math.random().toFixed(8),
        price: t[0],
        amount: t[1],
        type: t[3],
        dt: t[2],
      }));

    return { ...state, history: newHistory.concat(state.history).slice(0, 50) };
  },
  [actions.UPDATE_TICKER]: (state, { exchange, market, ticker }) => (
    exchange === state.exchange && market === state.market
      ? { ...state, ticker }
      : state
  ),
  [actions.GET_MY_ORDERS]: (state, { orders, fundId }) => {
    const stateId = state.fundId || state.groupId;

    if (stateId === fundId) {
      return { ...state, orders };
    }

    return state;
  },
  [actions.GET_GROUP_ORDER]: (state, action) => {
    const { open, closed } = state.orders;
    const order = open.find(order => order._id === action.order._id);

    if (order) {
      return {
        ...state,
        orders: {
          open: open.map(item => item._id === order._id ? action.order : item),
          closed,
        },
      };
    } else {
      return {
        ...state,
        orders: {
          open,
          closed: closed.map(item => item._id === action.order._id ? action.order : item),
        },
      };
    }
  },
  [actions.PLACE_ORDER]: (state, action) => {
    const order = state.orders.open.find(o => o._id === action.order._id);

    if (!order) {
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
      return { ...state, orders };
    } else {
      return state;
    }
  },
  [actions.UPDATE_ORDER]: (state, action) => {
    if (state.fundId !== action.fundId) { return state; }

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
        } else if (!order.isAlgo) {
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

    return { ...state, orders: { open, closed } };
  },
  [actions.CANCEL_ORDER]: (state, action) => {
    const order = state.orders.open.find(o => o._id === action.order._id);

    if (order) {
      const orders = {
        open: state.orders.open.filter(o => o._id !== action.order._id),
        closed: state.orders.closed,
      };

      if (order.filled > 0) {
        orders.closed = [action.order, ...state.orders.closed];
      }
      return { ...state, orders };
    }

    return state;
  },
  [actions.CHECK_URL_VALIDITY]: (state, { isValidUrl }) => ({ ...state, isValidUrl }),
};

export default reducerCreator(initialState, reducerList);
