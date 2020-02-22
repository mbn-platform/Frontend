import { UPDATE_EXCHANGES } from '../actions/exchanges';

export default function(state = [], action) {
  switch(action.type) {
    case UPDATE_EXCHANGES:
      // TODO: remove when will be implemented on backend side
      return action.exchanges.concat('kucoin');
    default:
      return state;
  }
}
