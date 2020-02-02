import { combineReducers } from 'redux';

import { reducerCreator } from 'generic/util';
import {
  DELETE_API_KEY,
  ADD_API_KEY,
  UPDATE_API_KEY,
  UPDATE_API_KEY_BALANCE,
  UPDATE_BOT_KEYS,
  ADD_BOT_KEYS,
  DELETE_BOT_KEYS
} from 'actions/apiKeys';
import {
  UPDATE_DASHBOARD, UPDATE_KEYS,
} from 'actions/dashboard';

const ownKeysReducerList = {
  [DELETE_API_KEY]: (keys, { apiKey }) => {
    return keys.filter(k => k._id !== apiKey._id);
  },
  [UPDATE_API_KEY]: (keys, { apiKey }) => {
    return keys.map(k => k._id === apiKey._id ? apiKey : k);
  },
  [ADD_API_KEY]: (keys, { apiKey }) => {
    const key = keys.find(key => key._id === apiKey._id);
    return key ? keys : keys.concat(apiKey);
  },
  [UPDATE_KEYS]: (_, { data }) => { return data; },
  [UPDATE_API_KEY_BALANCE]: (keys, { _id, balances, totalInBTC, totalInUSDT }) => {
    const key = keys.find(k => k._id === _id);

    if(!key) {
      return keys;
    }
    const updatedBalances = key.balances.map(b => {
      const updatedBalance = balances[b.name];
      return updatedBalance ? { ...b, ...updatedBalance } : b;
    });
    const newKey = {...key};
    newKey.balances = key.balances.length > 0 ? updatedBalances : balances;
    newKey.totalInBTC = totalInBTC;
    newKey.totalInUSDT = totalInUSDT;

    return keys.map(k => k._id === newKey._id ? newKey : k);
  },
};

const botKeysReducerList = {
  [DELETE_BOT_KEYS]: (keys, { keyID }) => {
    return keys.filter(k => k._id !== keyID);
  },
  [UPDATE_BOT_KEYS]: (_, { data }) => { return data; },
  [ADD_BOT_KEYS]: (keys, { data }) => { return [...keys, data]; },
};

const receivedKeysReducerList = {
  [UPDATE_DASHBOARD]: (_, { data }) => { return data.keys.receivedKeys; },
};

const ownKeys = reducerCreator([], ownKeysReducerList);
const botKeys = reducerCreator([], botKeysReducerList);
const receivedKeys = reducerCreator([], receivedKeysReducerList);

export default combineReducers({ ownKeys, receivedKeys, botKeys });
