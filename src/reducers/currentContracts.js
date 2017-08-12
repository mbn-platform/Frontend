import { UPDATE_CURRENT_CONTRACTS } from '../actions/currentContracts';

export default function(state = [], action) {
  switch(action.type) {
    case UPDATE_CURRENT_CONTRACTS:
      return action.currentContracts;
    default:
      return state;
  }
}
