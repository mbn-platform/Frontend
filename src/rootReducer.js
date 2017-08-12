import apiKeys from './reducers/apiKeys';
import currentContracts from './reducers/currentContracts';
import offers from './reducers/offers';
import { combineReducers } from 'redux';
import { UPDATE_DASHBOARD } from './actions/dashboard';

const combined = combineReducers({apiKeys, currentContracts, offers});

export default combined;

//export default function rootReducer(state, action) {
  //switch(action.type) {
    //case UPDATE_DASHBOARD:
      //const data = action.data;
      //return {...state, apiKeys: data.keys || [], currentContracts: data.contracts || []};
    //default:
      //return combined(state, action);
  //}
//}

