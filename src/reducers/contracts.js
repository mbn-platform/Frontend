import { UPDATE_CONTRACTS, RATE_CONTRACT } from '../actions/contracts';
import { UPDATE_DASHBOARD } from '../actions/dashboard';

export default function(state = [], action) {
  switch(action.type) {
    case UPDATE_CONTRACTS:
      return action.contracts;
    case RATE_CONTRACT:
      const feedback = action.feedback;
      const author = action.userId;
      const dt = action.time;
      const f = {
        author,
        dt,
        rate: feedback.rate,
        text: feedback.text,
      };
      const contract = state.find(c => c._id === feedback.offerId);
      const updated = {...contract, feedbacks: contract.feedbacks.concat(f)};
      return state.map(c => c._id === updated._id ? updated : c);
    default:
      return state;
  }
}
