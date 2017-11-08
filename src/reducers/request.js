import { SEND_OFFER } from '../actions/offers';
import { CLEAR_REQUEST } from '../actions/request';

export default function(state = {}, action) {
  switch(action.type) {
    case SEND_OFFER:
      return {...state, sendOffer: 'success'};
    case CLEAR_REQUEST:
      const newState = {...state};
      delete newState[action.name];
      return newState;
    default:
      return state;
  }
}
