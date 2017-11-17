import {RATE_CONTRACT } from '../actions/contracts';
import { UPDATE_DASHBOARD } from '../actions/dashboard';
import { CONTRACT_STATE_VERIFIED, CONTRACT_STATE_FINISHED, CONTRACT_STATE_HALTED } from '../constants';

export default function(state = {current: [], finished: []}, action) {
  switch(action.type) {
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
      const contract = state.finished.find(c => c._id === feedback.offerId);
      const updated = {...contract, feedbacks: contract.feedbacks.concat(f)};
      return {...state, finished: state.finished.map(c => c._id === updated._id ? updated : c)};
    default:
      return state;
  }
}
