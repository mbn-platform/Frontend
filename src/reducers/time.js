import { GET_TIME } from '../actions/time';

export default function(state = Date.now(), action) {
  switch(action.type) {
    case GET_TIME:
      return action.time;
    default:
      return state;
  }
}
