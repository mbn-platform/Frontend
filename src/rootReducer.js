import apiKeys from './reducers/apiKeys';
import contracts from './reducers/contracts';
import offers from './reducers/offers';
import auth from './reducers/auth';
import exchanges from './reducers/exchanges';
import { combineReducers } from 'redux';
import { UPDATE_DASHBOARD } from './actions/dashboard';

const combined = combineReducers({apiKeys, contracts, offers, auth, exchanges});

export default combined;
