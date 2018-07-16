import apiKeys from './reducers/apiKeys';
import contracts from './reducers/contracts';
import offers from './reducers/offers';
import auth from './reducers/auth';
import exchanges from './reducers/exchanges';
import time from './reducers/time';
import terminal from './reducers/terminal';
import request from './reducers/request';
import rates from './reducers/rates';
import profile from './reducers/profile';
import exchangesInfo from './reducers/exchangesInfo';
import { combineReducers } from 'redux';
import { calculateKeyBalance } from './generic/util';
import { LOGGED_OUT } from './actions/auth';
import { getInitialState } from './store';
import ratings from './reducers/ratings';

const combined = combineReducers({apiKeys, contracts, ratings, offers, auth, exchanges, time, request, terminal, rates, profile, exchangesInfo, selectedNet: (state = 'mainnet') => state});

const root = (state, action) => {
  switch(action.type) {
    case LOGGED_OUT: {
      const newState = getInitialState();
      saveReduxState({auth: {...newState.auth, loggedIn: false}});
      clearAppState();
      newState.selectedNet = state.selectedNet;
      return newState;
    }
  };
  let newState = combined(state, action);
  switch(action.type) {
    case 'UPDATE_API_KEY_BALANCE': {
      if(state.terminal.fund && state.terminal.fund._id === action._id) {
        const fund = newState.apiKeys.ownKeys.find(k => k._id === action._id);
        newState = {...newState, terminal: {...newState.terminal, fund}};
      }
      return newState;
    }
    case 'ON_NET_SELECT':
      let net = newState.selectedNet;
      if(net === 'mainnet') {
        net = 'testnet';
      } else {
        net = 'mainnet';
      }
      localStorage.setItem('selectedNet', net);
      return {...newState, selectedNet: net};
    default:
      return newState;
  }
};

export function saveReduxState(state) {
  localStorage.setItem('reduxState', JSON.stringify(state));
}

function clearAppState() {
  localStorage.removeItem('terminal.selectedMarket');
  localStorage.removeItem('terminal.selectedFund');
  localStorage.removeItem('terminal.selectedTime');
  localStorage.removeItem('terminal.selectedExchange');
  localStorage.removeItem('terminal.selectedInterval');
}

Array.prototype.findById = function(id) {
  for(let elem of this) {
    if(elem._id === id) {
      return elem;
    }
  }
};

export default root;
