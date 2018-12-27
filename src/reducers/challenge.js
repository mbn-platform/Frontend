import {UPDATE_CHALLENGE, NEXT_STATUS, NEXT_PARTICIPATE} from '../actions/challenge';

const challenge = (state = null, action) => {
  switch(action.type) {
    case NEXT_STATUS:
      return {...(state || {}), ...action.next};
    case UPDATE_CHALLENGE:
      return {...state, ...action.challenge};
    case NEXT_PARTICIPATE:
      return {...state, nextRound: true};
    default:
      return state;
  }
};

export default challenge;

