import apiKeys from './reducers/apiKeys';
import currentContracts from './reducers/currentContracts';
import offers from './reducers/offers';
import auth from './reducers/auth';
import { combineReducers } from 'redux';

const combined = combineReducers({apiKeys, currentContracts, offers, auth});

export default combined;

