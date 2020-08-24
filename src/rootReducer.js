import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

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
import { combineReducers } from 'redux';
import { LOGGED_OUT } from './actions/auth';
import ratings from './reducers/ratings';
import stakeInfo from './reducers/stakeInfo';
import stakeTr from './reducers/stakeTr';
import quickNotif from './reducers/quickNotif';
import tariffs from './reducers/tariffs';
import payments from './reducers/payments';
import selection from './reducers/selection';
import assetGroups from './reducers/assetGroups';

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
  terminal,
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
  switch(action.type) {
    case LOGGED_OUT: {
      const fundId = localStorage.getItem('lastSelectedFund');
      localStorage.clear();
      if (fundId) {
        localStorage.setItem('lastSelectedFund', fundId);
      }
      state = undefined;
      break;
    }
    default:
      break;
  };
  let newState = combined(state, action);
  switch(action.type) {
    case 'UPDATE_API_KEY_BALANCE': {
      if(state.terminal.fund && state.terminal.fund._id === action._id) {
        const fund = newState.apiKeys.ownKeys.find(k => k._id === action._id);
        newState = {...newState, terminal: {...newState.terminal, fund}};
      }
      return newState;
    }
    case 'UPDATE_GROUP_BALANCE': {
      const activeGroup = state.terminal.assetGroup;
      if (activeGroup && activeGroup._id === action._id) {
        newState = {...newState, terminal: {...newState.terminal, assetGroup: {...activeGroup, balances: action.balances}}};
      }
      return newState;
    }
    case 'UPDATE_CONTRACT_BALANCE': {
      if(state.terminal.fund && state.terminal.fund._id === action._id) {
        const fund = newState.contracts.current.find(c => c._id === action._id);
        newState.terminal.fund = fund;
      }
      return newState;
    }
    default:
      return newState;
  }
};

const rootPersistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
};

export default persistReducer(rootPersistConfig, rootReducer);
