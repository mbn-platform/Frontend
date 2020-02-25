import { UPDATE_EXCHANGES } from '../actions/exchanges';

export default function(state = [], action) {
  switch(action.type) {
    case UPDATE_EXCHANGES:
      return action.exchanges;
    default:
      return state;
  }
}
