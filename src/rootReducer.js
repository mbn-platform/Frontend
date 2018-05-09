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

const combined = combineReducers({apiKeys, contracts, ratings, offers, auth, exchanges, time, request, terminal, rates, profile, exchangesInfo, selectedNet: (state = 'testnet') => state});

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
    case 'UPDATE_EXCHANGE_RATES': {
      const rates = action.rates;
      const current = calculateBalances(newState.contracts.current, newState.apiKeys, rates);
      const incoming = calculateBalances(newState.offers.incoming, newState.apiKeys, rates);
      const outgoing = calculateBalances(newState.offers.outgoing, newState.apiKeys, rates);
      return {...newState, contracts: { ...newState.contracts, current}, offers: {incoming, outgoing}};
    }
    case 'UPDATE_DASHBOARD': {
      newState.contracts.current.forEach(c => {
        c.balance = getItemBalance(c, newState.apiKeys, newState.rates);
      });
      newState.offers.incoming.forEach(c => {
        c.balance = getItemBalance(c, newState.apiKeys, newState.rates);
      });
      newState.offers.outgoing.forEach(c => {
        c.balance = getItemBalance(c, newState.apiKeys, newState.rates);
      });
      const allowed = allowedApiKeys(newState.apiKeys, newState.contracts.current);
      let selectedFund;
      if(newState.terminal.selectedFund) {
        selectedFund = allowed.find(k => k._id === newState.terminal.selectedFund._id);
      } else {
        selectedFund = allowed[0] || null;
      }
      return {...newState, terminal: {...newState.terminal, selectedFund}};
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
function allowedApiKeys(apiKeys, contracts) {
  const allowedOwnKeys = apiKeys.ownKeys.filter(k => k.state === 'FREE');
  const allowedReceivedKeys = apiKeys.receivedKeys.filter(k => {
    const contract = contracts.find(c => c.keyId === k._id);
    return !!contract;
  });
  return allowedOwnKeys.concat(allowedReceivedKeys);
}

function getItemBalance(item, apiKeys, rates) {
  const key = apiKeys.ownKeys.findById(item.keyId) ||
    apiKeys.receivedKeys.findById(item.keyId);
  if(key) {
    return calculateKeyBalance(key, item.currency, rates);
  } else {
    return null;
  }
}
function calculateBalances(array, apiKeys, rates) {
  return array.map(item => {
    const balance = getItemBalance(item, apiKeys, rates);
    return {...item, balance};
  });
}

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
