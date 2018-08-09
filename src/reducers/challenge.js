import {UPDATE_CHALLENGE} from '../actions/challenge';

const challenge = (state = null, action) => {
  switch(action.type) {
    case UPDATE_CHALLENGE:
      return action.challenge
    default:
      return state;
  }
};

export default challenge;

