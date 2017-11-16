import {RATE_CONTRACT } from '../actions/contracts';
import { UPDATE_DASHBOARD } from '../actions/dashboard';
import { CONTRACT_STATE_VERIFIED, CONTRACT_STATE_FINISHED, CONTRACT_STATE_HALTED } from '../constants';

export default function(state = {current: [], finished: []}, action) {
  switch(action.type) {
    case UPDATE_DASHBOARD:
      const all = [...action.data.offers.outgoing, ...action.data.offers.incoming];
      const current = all.filter(c => c.state === CONTRACT_STATE_VERIFIED);
      const finished = all.filter(c => c.state === CONTRACT_STATE_FINISHED || c.state === CONTRACT_STATE_HALTED);
      return { current, finished };
    case RATE_CONTRACT:
      const contract = action.contract;
      return state.map(c => c._id === contract._id ? contract : c);
    default:
      return state;
  }
}
