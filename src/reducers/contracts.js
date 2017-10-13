import { UPDATE_CONTRACTS } from '../actions/contracts';
import { UPDATE_DASHBOARD } from '../actions/dashboard';

export default function(state = [], action) {
  switch(action.type) {
    case UPDATE_CONTRACTS:
      return action.contracts;
    case UPDATE_DASHBOARD:
      return action.data.contracts;
    default:
      return state;
  }
}
