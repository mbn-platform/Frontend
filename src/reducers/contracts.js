import { UPDATE_CONTRACTS, RATE_CONTRACT } from '../actions/contracts';
import { UPDATE_DASHBOARD } from '../actions/dashboard';

export default function(state = [], action) {
  switch(action.type) {
    case UPDATE_CONTRACTS:
      return action.contracts;
    case UPDATE_DASHBOARD:
      const data = [...action.data.offers.outgoing, ...action.data.offers.incoming].filter(o => o.state === 'FINISHED');
      return data;
    case RATE_CONTRACT:
      const contract = action.contract;
      return state.map(c => c._id === contract._id ? contract : c);
    default:
      return state;
  }
}
