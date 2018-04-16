import { ACCEPT_OFFER, REJECT_OFFER, CANCEL_OFFER, SEND_OFFER, PAY_OFFER } from '../actions/offers';
import { FETCH_CONTRACTS } from '../actions/contracts';
import { makeId } from '../generic/util';
import { combineReducers } from 'redux';

function incoming(state = [], action) {
  switch(action.type) {
    case REJECT_OFFER:
      return state.filter(o => o._id !== action.offer._id);
    case ACCEPT_OFFER:
      return state.map(o => o._id === action.offer._id ? action.offer : o);
    case FETCH_CONTRACTS:
      return action.offers.incoming;
    default:
      return state;
  }
}

function outgoing(state = [], action) {
  switch(action.type) {
    case FETCH_CONTRACTS:
      return action.offers.outgoing;
    case CANCEL_OFFER:
      return state.filter(offer => offer._id !== action.offer._id);
    case SEND_OFFER:
      const offer = action.offer;
      offer._id = makeId();
      offer.date = (new Date()).toISOString();
      offer.fromUser = [{name: 'me'}];
      return state.concat(offer);
    case PAY_OFFER:
      return state.filter(offer => offer._id !== action.offer._id);
    default:
      return state;
  }
}

export default combineReducers({outgoing, incoming});
