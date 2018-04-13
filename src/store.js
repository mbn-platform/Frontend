import { createStore, compose, applyMiddleware } from 'redux';
import reducer from './rootReducer';
import thunk from 'redux-thunk';
import socketMiddleware from './socket_middleware';
import apiMiddleware from './apiMiddleware';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  reducer,
  getReduxState(),
  composeEnhancers(
    applyMiddleware(thunk, socketMiddleware, apiMiddleware),
  )
);
export default store;

export function getInitialState() {
  return {
    apiKeys: {
      ownKeys: [],
      receivedKeys: []
    },
    contracts: {
      current: [],
      finished: []
    },
    offers: {
      outgoing: [],
      incoming: []
    },
    auth: {
      loggedIn: false,
      profile: {
        contractSettings: {}
      }
    },
    exchanges: [],
    time: null,
    request: {},
    terminal: {
      apiKey: null,
      exchange: 'bittrex',
      market: 'USDT-BTC',
      interval: '5m',
      orderBook: {sell: [], buy: [], smap: {}, bmap: {}},
      history: [],
      ticker: null,
      orders: {open: [], closed: []},
    },
    rates: null,
    profile: {
      contractSettings: {},
      feedbacks: []
    },
    exchangesInfo: {},
    selectedNet: null
  };
}

function getReduxState() {
  let state = localStorage.getItem('reduxState');
  let selectedNet = localStorage.getItem('selectedNet') || 'mainnet';
  if(state) {
    state = {...getInitialState(), ...JSON.parse(state)};
    state.selectedNet = selectedNet;
  } else {
    state = getInitialState();
  }
  return state;
}
