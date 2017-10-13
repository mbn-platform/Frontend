import { ACCEPT_OFFER, REJECT_OFFER, CANCEL_OFFER } from '../actions/offers';
import { UPDATE_DASHBOARD } from '../actions/dashboard';
import { combineReducers } from 'redux';

function incoming(state = [], action) {
  switch(action.type) {
    case REJECT_OFFER:
    case ACCEPT_OFFER:
      return state.filter(offer => offer._id !== action.offer._id);
    case UPDATE_DASHBOARD:
      return action.data.offers.incoming;
    default:
      return state;
  }
}

function outgoing(state = [], action) {
  switch(action.type) {
    case CANCEL_OFFER:
      return state.filter(offer => offer._id !== action.offer._id);
    case UPDATE_DASHBOARD:
      return action.data.offers.outgoing;
    default:
      return state;
  }
}

export default combineReducers({outgoing, incoming});
