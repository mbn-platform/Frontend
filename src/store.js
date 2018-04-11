import { createStore, compose, applyMiddleware } from 'redux';
import reducer from './rootReducer';
import thunk from 'redux-thunk';
import socketMiddleware from './socket_middleware';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  reducer,
  getReduxState(),
  composeEnhancers(
    applyMiddleware(thunk, socketMiddleware),
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
      selectedApiKey: null,
      selectedMarket: null,
      orders: {
        open: [],
        completed: []
      },
      ratings: [],
      ticker: {},
      orderBook: {
        sell: [],
        buy: []
      },
      history: []
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
    state = JSON.parse(state);
    state.selectedNet = selectedNet;
  } else {
    state = getInitialState();
  }
  return state;
}
