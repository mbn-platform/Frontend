import io from 'socket.io-client';
import { SELECT_MARKET, SELECT_EXCHANGE, EXCHANGE_MARKETS,
  TRADING_DATA_START, TRADING_DATA_STOP } from './actions/terminal';
import { LOGGED_OUT, LOGGED_IN } from './actions/auth';
import {updateKeyBalance} from './actions/apiKeys';
import {updateOrderBook, updateHistory, updateRates, updateTicker, selectMarket} from './actions/terminal';
import { UPDATE_ORDER } from './actions/terminal';
import { addQuickNotif } from './actions/quickNotif';
import { ACCEPT_OFFER, NEW_OFFER, CANCEL_OFFER, REJECT_OFFER, VERIFY_OFFER, TIMEOUT_OFFER } from './actions/offers';
let socket;

function createSocket(store) {
  const path = process.env.REACT_APP_WEBSOCKET_ADDRESS;
  const socket = io('', {
    path,
  });
  socket.on('action', action => {
    store.dispatch(action);
    switch (action.type) {
      case UPDATE_ORDER: {
        if (action.order && action.order.state === 'CLOSED') {
          store.dispatch(addQuickNotif({
            type: 'order_closed',
            object: action.order,
          }));
        }
        break;
      }
      case NEW_OFFER: {
        if (isTrader(store, action.offer)) {
          store.dispatch(addQuickNotif({
            type: 'request_created',
            object: action.offer,
          }));
        }
        break;
      }
      case REJECT_OFFER: {
        if (isInvestor(store, action.offer)) {
          store.dispatch(addQuickNotif({
            type: 'request_rejected',
            object: action.offer,
          }));
        }
        break;
      }
      case CANCEL_OFFER: {
        if (isTrader(store, action.offer)) {
          store.dispatch(addQuickNotif({
            type: 'request_canceled',
            object: action.offer,
          }));
        }
        break;
      }
      case ACCEPT_OFFER: {
        if (isInvestor(store, action.offer)) {
          store.dispatch(addQuickNotif({
            type: 'request_accepted',
            object: action.offer,
          }));
        }
        break;
      }
      case VERIFY_OFFER: {
        store.dispatch(addQuickNotif({
          type: 'request_verified',
          object: action.offer,
        }));
        break;
      }
      case TIMEOUT_OFFER: {
        store.dispatch(addQuickNotif({
          type: 'request_timed_out',
          object: action.offer,
        }));
        break;
      }
      default:
        break;
    }
  });
  socket.on('orders', ({name, content}) => {
    const [exchange,, market] = name.split('.');
    const buy = content.bids;
    const sell = content.asks;
    store.dispatch(updateOrderBook(exchange, market, {buy, sell}));
  });
  socket.on('trades', ({name, content}) => {
    const [exchange,, market] = name.split('.');
    store.dispatch(updateHistory(exchange, market, content.trades));
  });
  socket.on('rates', ({name, content} ) => {
    const [exchange] = name.split('.');
    store.dispatch(updateRates(exchange, content.rates));
  });
  socket.on('ticker', ({name, content}) => {
    const [exchange,,market] = name.split('.');
    store.dispatch(updateTicker(exchange, market, content.ticker));
  });
  socket.on('balances', ({_id, content, totalInBTC, totalInUSDT}) => {
    store.dispatch(updateKeyBalance(_id, content.balances, totalInBTC, totalInUSDT));
  });
  return socket;
}

function isTrader(store, contract) {
  const state = store.getState();
  if (state.auth &&
    state.auth.loggedIn && state.auth.profile &&
    state.auth.profile._id === contract.to._id) {
    return true;
  } else {
    return false;
  }
}
function isInvestor(store, contract) {
  const state = store.getState();
  if (state.auth &&
    state.auth.loggedIn && state.auth.profile &&
    state.auth.profile._id === contract.from._id) {
    return true;
  } else {
    return false;
  }
}
const socketMiddleware = store => next => action => {
  switch(action.type) {
    case LOGGED_IN: {
      if(!socket) {
        socket = createSocket(store);
      }
      break;
    }
    case TRADING_DATA_START: {
      if (!socket) {
        socket = createSocket(store);
      }
      if(socket) {
        const state = store.getState();
        const {exchange} = state.terminal;

        socket.emit('market', {exchange});
        socket.emit('rates', {exchange});
      }
      return;
    }
    case TRADING_DATA_STOP: {
      if(socket) {
        socket.emit('off_data');
      }
      return;
    }
    case LOGGED_OUT:
      if(socket) {
        socket.disconnect();
        socket = null;
      }
      break;
    case SELECT_MARKET: {
      if(socket) {
        const state = store.getState();
        const {exchange} = state.terminal;
        const symbol = action.market;
        socket.emit('market', {exchange, symbol});
      }
      break;
    }
    case SELECT_EXCHANGE: {
      if(socket) {
        socket.emit('rates', {exchange: action.exchange});
        const state = store.getState();
        const exchangeInfo = state.exchangesInfo[action.exchange];
        const symbol = state.terminal.market;
        if(exchangeInfo && exchangeInfo.markets) {
          const hasMarket = !!exchangeInfo.markets.find(m => m.symbol === symbol);
          if(hasMarket) {
            socket.emit('market', {exchange: action.exchange, symbol});
          } else {
            store.dispatch(selectMarket('USDT-BTC'));
          }
        } else if(action.restore) {
          socket.emit('market', {exchange: action.exchange, symbol});
        } else {
          socket.emit('market', {exchange: action.exchange, symbol});
        }
      }
      break;
    }
    case EXCHANGE_MARKETS: {
      const terminal = store.getState().terminal;
      if(terminal.exchange !== action.exchange) {
        break;
      }
      const currentMarket = terminal.market;
      const newMarkets = action.markets;
      const marketExists = newMarkets.find(m => m.symbol === currentMarket);
      if(!marketExists) {
        store.dispatch(selectMarket('USDT-BTC'));
      }
      break;
    }
    default:
      break;
  }
  next(action);
};

export default socketMiddleware;
