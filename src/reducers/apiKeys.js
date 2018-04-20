import { DELETE_API_KEY, ADD_API_KEY, UPDATE_API_KEY, UPDATE_API_KEY_BALANCE } from '../actions/apiKeys';
import {UPDATE_DASHBOARD, UPDATE_KEYS} from '../actions/dashboard';
import { SEND_OFFER, CANCEL_OFFER, REJECT_OFFER } from '../actions/offers';
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
    case CANCEL_OFFER:
      return keys.map(k => k._id === action.offer.keyId ? {...k, state: 'FREE'} : k);
    case SEND_OFFER:
      return keys.map(k => k._id === action.offer.keyId ? {...k, state: 'USED'} : k);
    default:
      return keys;
  }
}

function receivedKeys(keys = [], action) {
  switch(action.type) {
    case UPDATE_DASHBOARD:
      return action.data.keys.receivedKeys;
    case REJECT_OFFER:
      return keys.filter(k => k._id !== action.offer.keyId);
    default:
      return keys;
  }
}

function balances(state = {}, action) {
  switch(action.type) {
    case UPDATE_API_KEY_BALANCE: {
      const {balances, _id} = action;
      const newBalance = {...state[_id], ...balances};
      return {...state, [_id]: newBalance};
    }
    default:
      return state;
  }
}

export default combineReducers({ownKeys, receivedKeys, balances});
