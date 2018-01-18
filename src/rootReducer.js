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
import { UPDATE_DASHBOARD } from './actions/dashboard';
import { UPDATE_EXCHANGE_RATES } from './actions/terminal';

const combined = combineReducers({apiKeys, contracts, offers, auth, exchanges, time, request, terminal, rates});

const root = (state, action) => {
  const newState = combined(state, action);
  switch(action.type) {
    case UPDATE_DASHBOARD:
    case UPDATE_EXCHANGE_RATES:
      const rates = newState.rates;
      let { ownKeys, receivedKeys } = newState.apiKeys;
      ownKeys = ownKeys.map(key => updateKeySumBalance(key, rates));
      receivedKeys = receivedKeys.map(key => updateKeySumBalance(key, rates));
      newState.apiKeys = {ownKeys, receivedKeys};
      break;
    default:
      break;
  }
  return newState;
};

function updateKeySumBalance(key, rates) {
  const c = key.currencies;
  const balance = c.reduce((accum, cur) => {
    const name = cur.name;
    const value = cur.value || 0;
    let add;
    if(name === 'USDT') {
      add = value / rates['USDT']['BTC'];
    } else {
      let rate = rates['BTC'][name];
      if(rate === undefined) {
        return accum;
      };
      add = rate * value;
    }
    return accum + add;
  }, 0);
  return {...key, balance: parseFloat(balance.toFixed(8))};
}

export default root;
