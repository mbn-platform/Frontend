import apiKeys from './reducers/apiKeys';
import contracts from './reducers/contracts';
import offers from './reducers/offers';
import auth from './reducers/auth';
import exchanges from './reducers/exchanges';
import time from './reducers/time';
import terminal from './reducers/terminal';
import request from './reducers/request';
import { combineReducers } from 'redux';

const combined = combineReducers({apiKeys, contracts, offers, auth, exchanges, time, request, terminal});

export default combined;
