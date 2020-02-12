import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { LOGGED_OUT } from './actions/auth';
import apiKeys from './reducers/apiKeys';
import contracts from './reducers/contracts';
import offers from './reducers/offers';
import auth from './reducers/auth';
import exchanges from './reducers/exchanges';
import challenge from './reducers/challenge';
import time from './reducers/time';
import terminal from './reducers/terminal';
import request from './reducers/request';
import notification from './reducers/notification';
import hashlog from './reducers/hashlog';
import actionList from './reducers/actionsList';
import rates from './reducers/rates';
import modal from './reducers/modal';
import profile from './reducers/profile';
import exchangesInfo from './reducers/exchangesInfo';
import ratings from './reducers/ratings';
import stakeInfo from './reducers/stakeInfo';
import stakeTr from './reducers/stakeTr';
import quickNotif from './reducers/quickNotif';
import tariffs from './reducers/tariffs';
import payments from './reducers/payments';
import selection from './reducers/selection';
import assetGroups from './reducers/assetGroups';

const terminalPersistConfig = {
  key: 'terminal',
  storage,
  blacklist: ['orderBook', 'history', 'ticker', 'isValidUrl'],
};

const rootPersistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'assetGroups'],
};

const combined = combineReducers({
  apiKeys,
  notification,
  actionList,
  contracts,
  ratings,
  modal,
  offers,
  auth,
  hashlog,
  exchanges,
  time,
  request,
  challenge,
  terminal: persistReducer(terminalPersistConfig, terminal),
  rates,
  profile,
  stakeInfo,
  stakeTr,
  exchangesInfo,
  quickNotif,
  tariffs,
  payments,
  selection,
  assetGroups,
});

const rootReducer = (state, action) => {
  if (action.type === LOGGED_OUT) {
    localStorage.clear();

    return combined(undefined, action);
  }

  return combined(state, action);
};

export default persistReducer(rootPersistConfig, rootReducer);
