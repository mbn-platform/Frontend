import {
  DELETE_API_KEY,
  ADD_API_KEY,
  UPDATE_API_KEY,
  UPDATE_API_KEY_BALANCE,
  UPDATE_BOT_KEYS,
  ADD_BOT_KEYS,
  DELETE_BOT_KEYS
} from '../actions/apiKeys';
import {UPDATE_DASHBOARD, UPDATE_KEYS} from '../actions/dashboard';
import { combineReducers } from 'redux';

function ownKeys(keys = [], action) {
  switch(action.type) {
    case DELETE_API_KEY:
      return keys.filter(k => k._id !== action.apiKey._id);
    case UPDATE_API_KEY:
      return keys.map(k => k._id === action.apiKey._id ?
        action.apiKey : k);
    case ADD_API_KEY:
      const key = keys.find(key => key._id === action.apiKey._id);
      if(!key) {
        return keys.concat(action.apiKey);
      } else {
        return keys;
      }
    case UPDATE_KEYS:
      return action.data;
    case UPDATE_API_KEY_BALANCE: {
      const key = keys.find(k => k._id === action._id);
      if(!key) {
        return keys;
      }
      const balances = action.balances;
      const updatedBalances = key.balances.map(b => {
        const updatedBalance = balances[b.name];
        if(updatedBalance) {
          return {...b, ...updatedBalance};
        } else {
          return b;
        }
      });
      const newKey = {...key};
      newKey.balances = key.balances.length > 0 ? updatedBalances : action.balances;
      newKey.totalInBTC = action.totalInBTC;
      newKey.totalInUSDT = action.totalInUSDT;
      return keys.map(k => k._id === newKey._id ? newKey : k);
    }
    default:
      return keys;
  }
}

function botKeys(keys = [], {type, data, _id, keyID}) {
  switch(type) {
    case DELETE_BOT_KEYS:
      return keys.filter(k => k._id !== keyID);
    case UPDATE_BOT_KEYS:
      return data;
    case ADD_BOT_KEYS:
      const key = keys.find(key => key._id === _id);
      if(!key) {
        return keys.concat(_id);
      } else {
        return keys;
      }
    default:
      return keys;
  }
}

function receivedKeys(keys = [], action) {
  switch(action.type) {
    case UPDATE_DASHBOARD:
      return action.data.keys.receivedKeys;
    default:
      return keys;
  }
}


export default combineReducers({ownKeys, receivedKeys, botKeys});
