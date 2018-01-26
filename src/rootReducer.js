import apiKeys from './reducers/apiKeys';
import contracts from './reducers/contracts';
import offers from './reducers/offers';
import auth from './reducers/auth';
import exchanges from './reducers/exchanges';
import time from './reducers/time';
import terminal from './reducers/terminal';
import request from './reducers/request';
import rates from './reducers/rates';
import { combineReducers } from 'redux';
import { calculateKeyBalance } from './generic/util';

const combined = combineReducers({apiKeys, contracts, offers, auth, exchanges, time, request, terminal, rates});

const root = (state, action) => {
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
      let selectedApiKey;
      if(newState.selectedApiKey) {
        selectedApiKey = allowed.find(k => k._id === newState.terminal.selectedApiKey);
      } else {
        selectedApiKey = allowed[0] || null;
      }
      return {...newState, terminal: {...newState.terminal, selectedApiKey}};
    }
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
    return 0;
  }
}
function calculateBalances(array, apiKeys, rates) {
  return array.map(item => {
    const balance = getItemBalance(item, apiKeys, rates);
    return {...item, balance};
  });
}

Array.prototype.findById = function(id) {
  for(let elem of this) {
    if(elem._id === id) {
      return elem;
    }
  }
};

export default root;
