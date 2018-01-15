import { DELETE_API_KEY, ADD_API_KEY, UPDATE_API_KEY } from '../actions/apiKeys';
import { UPDATE_DASHBOARD } from '../actions/dashboard';
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
      return keys.concat(action.apiKey);
    case UPDATE_DASHBOARD:
      return action.data.keys.ownKeys;
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

export default combineReducers({ownKeys, receivedKeys});
