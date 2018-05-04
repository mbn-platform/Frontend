import {UPDATE_RATINGS} from '../actions/terminal';

export default function ratings(state = [], action) {
  switch(action.type) {
    case UPDATE_RATINGS:
      return action.rating;
    default:
      return state;
  }
}
