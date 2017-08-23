import apiKeys from './reducers/apiKeys';
import contracts from './reducers/contracts';
import offers from './reducers/offers';
import auth from './reducers/auth';
import exchanges from './reducers/exchanges';
import { combineReducers } from 'redux';
import { UPDATE_DASHBOARD } from './actions/dashboard';

const combined = combineReducers({apiKeys, contracts, offers, auth, exchanges});

export default function(state, action) {
  switch(action.type) {
    case UPDATE_DASHBOARD:
      const apiKeys = action.data.keys || [];
      const contracts = action.data.contracts || [];
      const offers = action.data.offers || [];
      return {...state, apiKeys, contracts, offers};
    default:
      return combined(state, action);
  }
};
