import io from 'socket.io-client';
import { WEBSOCKET_CONNECT, WEBSOCKET_DISCONNECT } from './actions/websocket';
import { SELECT_MARKET } from './actions/terminal';
import { LOGGED_OUT, LOGGED_IN } from './actions/auth';
let socket;
const socketMiddleware = store => next => action => {
  switch(action.type) {
    case WEBSOCKET_CONNECT: {
      if(!socket) {
        socket = io('http://localhost:7001');
        socket.on('connect', () => {
          const state = store.getState();
          socket.emit('market', {exchange: 'bittrex', symbol: state.terminal.selectedMarket});
          socket.emit('candles', {exchange: 'bittrex', symbol: state.terminal.selectedMarket, interval: state.terminal.interval});
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
        socket.emit('market', {exchange: 'bittrex', symbol: action.market});
      }
      break;
    }
    case 'SELECT_INTERVAL': {
      if(socket) {
        socket.emit('candles', {exchange: 'bittrex', symbol: store.getState().terminal.selectedMarket, interval: action.interval});
      }
      break;
    }
    default:
      break;
  }
  next(action);
};

export default socketMiddleware;
