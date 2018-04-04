import io from 'socket.io-client';
import { WEBSOCKET_CONNECT, WEBSOCKET_DISCONNECT } from './actions/websocket';
import { SELECT_MARKET } from './actions/terminal';
import { LOGGED_OUT, LOGGED_IN } from './actions/auth';
import {updateOrderBook, updateHistory, updateRates, updateTicker} from './actions/terminal';
let socket;
const socketMiddleware = store => next => action => {
  switch(action.type) {
    case WEBSOCKET_CONNECT: {
      if(!socket) {
        socket = io();
        socket.on('connect', () => {
          const state = store.getState();
          const {exchange, market: symbol, interval} = state.terminal;
          socket.emit('market', {exchange, symbol});
          socket.emit('candles', {exchange, symbol, interval});
          socket.emit('rates');
        });
        socket.on('orders', ({name, content}) => {
          const [exchange, orders, market] = name.split('.');
          const buy = content.bids;
          const sell = content.asks;
          store.dispatch(updateOrderBook(exchange, market, {buy, sell}));
        });
        socket.on('trades', ({name, content}) => {
          const [exchange, trades, market] = name.split('.');
          store.dispatch(updateHistory(exchange, market, content.trades))
        });
        socket.on('rates', ({name, content} ) => {
          const [exchange] = name.split('.');
          store.dispatch(updateRates(exchange, content.rates));
        });
        socket.on('ticker', ({name, content}) => {
          const [exchange, ticker, market] = name.split('.');
          store.dispatch(updateTicker(exchange, market, content));

        });
      }
      return;
    }
    case WEBSOCKET_DISCONNECT:
      if(socket) {
        socket.disconnect();
        socket = null;
      }
      return;
    case SELECT_MARKET: {
      if(socket) {
        const state = store.getState();
        const {exchange} = state.terminal;
        const symbol = action.market;
        socket.emit('market', {exchange, symbol});
      }
      break;
    }
    case 'SELECT_INTERVAL': {
      if(socket) {
        const state = store.getState();
        const {exchange, symbol} = state.terminal; 
        socket.emit('candles', {exchange, symbol, interval: action.interval});
      }
      break;
    }
    default:
      break;
  }
  next(action);
};

export default socketMiddleware;
