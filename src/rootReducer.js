import apiKeys from './reducers/apiKeys';
import contracts from './reducers/contracts';
import offers from './reducers/offers';
import auth from './reducers/auth';
import exchanges from './reducers/exchanges';
import challenge from './reducers/challenge';
import time from './reducers/time';
import terminal from './reducers/terminal';
import request from './reducers/request';
import rates from './reducers/rates';
import modal from './reducers/modal';
import profile from './reducers/profile';
import exchangesInfo from './reducers/exchangesInfo';
import { combineReducers } from 'redux';
import { LOGGED_OUT } from './actions/auth';
import { getInitialState } from './store';
import ratings from './reducers/ratings';

const combined = combineReducers(
  {
    apiKeys,
    contracts,
    ratings,
    modal,
    offers,
    auth,
    exchanges,
    time,
    request,
    challenge,
    terminal,
    rates,
    profile,
    exchangesInfo
  });

const root = (state, action) => {
  switch(action.type) {
    case LOGGED_OUT: {
      const newState = getInitialState();
      saveReduxState({auth: {...newState.auth, loggedIn: false}});
      clearAppState();
      return newState;
    }
    default:
      break;
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
    case 'UPDATE_CONTRACT_BALANCE': {
      if(state.terminal.fund && state.terminal.fund._id === action._id) {
        const fund = newState.contracts.current.find(c => c._id === action._id);
        newState.terminal.fund = fund;
      }
      return newState;
    }
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

export default root;
