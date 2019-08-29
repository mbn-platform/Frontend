import {UPDATE_CHALLENGE, NEXT_STATUS, NEXT_PARTICIPATE} from '../actions/challenge';
import {PROFIT_CALCULATION} from '../actions/profile';

const challenge = (state = null, action) => {
  switch(action.type) {
    case NEXT_STATUS:
      return {...(state || {}), ...action.next};
    case UPDATE_CHALLENGE:
      return {...state, ...action.challenge};
    case NEXT_PARTICIPATE:
      return {...state, nextRound: true};
    case PROFIT_CALCULATION:
      return {...state, calculation: action.info};
    default:
      return state;
  }
};

export default challenge;

