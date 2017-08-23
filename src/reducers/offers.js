import { ACCEPT_OFFER, REJECT_OFFER, CANCEL_OFFER } from '../actions/offers';
import { combineReducers } from 'redux';

function incoming(state = [], action) {
  switch(action.type) {
    case REJECT_OFFER:
    case ACCEPT_OFFER:
      return state.filter(offer => offer._id !== action.offer._id);
    default:
      return state;
  }
}

function outgoing(state = [], action) {
  switch(action.type) {
    case CANCEL_OFFER:
      return state.filter(offer => offer._id !== action.offer._id);
    default:
      return state;
  }
}

export default combineReducers({outgoing, incoming});
