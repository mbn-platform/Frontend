import {
  ACCEPT_OFFER,
  REJECT_OFFER,
  CANCEL_OFFER,
  SEND_OFFER,
  PAY_OFFER,
  NEW_OFFER,
  VERIFY_OFFER
} from '../actions/offers';
import { FETCH_CONTRACTS } from '../actions/contracts';
import { makeId } from '../generic/util';
import { combineReducers } from 'redux';

function incoming(state = [], action) {
  switch(action.type) {
    case CANCEL_OFFER:
      if(action.userId !== action.offer.to._id) {
        return state;
      }
      return state.filter(offer => offer._id !== action.offer._id);
    case REJECT_OFFER:
      if(action.userId !== action.offer.to._id) {
        return state;
      }
      return state.filter(o => o._id !== action.offer._id);
    case ACCEPT_OFFER:
      if(action.userId !== action.offer.to._id) {
        return state;
      }
      return state.map(o => o._id === action.offer._id ? action.offer : o);
    case FETCH_CONTRACTS:
      return action.offers.incoming;
    case NEW_OFFER:
      const offer = action.offer;
      return state.concat(offer);
    default:
      return state;
  }
}

function outgoing(state = [], action) {
  switch(action.type) {
    case FETCH_CONTRACTS:
      return action.offers.outgoing;
    case REJECT_OFFER:
      if(action.userId !== action.offer.from._id) {
        return state;
      }
      return state.filter(o => o._id !== action.offer._id);
    case CANCEL_OFFER:
      if(action.userId !== action.offer.from._id) {
        return state;
      }
      return state.filter(offer => offer._id !== action.offer._id);
    case ACCEPT_OFFER:
      if(action.userId !== action.offer.from._id) {
        return state;
      }
      return state.map(o => o._id === action.offer._id ? action.offer : o);
    case SEND_OFFER:
      const offer = action.offer;
      return state.concat(offer);
    case VERIFY_OFFER:
      return state.filter(offer => offer._id !== action.offer._id)
    case PAY_OFFER:
      return state.filter(offer => offer._id !== action.offer._id);
    default:
      return state;
  }
}

export default combineReducers({outgoing, incoming});
