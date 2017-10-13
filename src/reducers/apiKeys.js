import { DELETE_API_KEY, ADD_API_KEY, UPDATE_API_KEY } from '../actions/apiKeys';
import { UPDATE_DASHBOARD } from '../actions/dashboard';

const KEYS = {ownKeys: [], receivedKeys: []};

export default function(state = KEYS, action) {
  switch(action.type) {
    case DELETE_API_KEY: {
      const ownKeys = state.ownKeys.filter(apiKey => apiKey._id !== action.apiKey._id);
      return {...state, ownKeys};
    }
    case ADD_API_KEY: {
      const ownKeys = state.ownKeys.concat(action.apiKey);
      return {...state, ownKeys};
    }
    case UPDATE_API_KEY: {
      const ownKeys = state.ownKeys.map(apiKey => apiKey._id === action.apiKey._id ? action.apiKey : apiKey);
      return {...state, ownKeys};
    }
    case UPDATE_DASHBOARD: {
      return action.data.keys;
    }
    default:
      return state;
  }
}
