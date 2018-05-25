import {RATE_CONTRACT, FETCH_CONTRACTS, UPDATE_CONTRACT_BALANCE} from '../actions/contracts';
import {PAY_OFFER, VERIFY_OFFER} from '../actions/offers';
import { makeId } from '../generic/util';
import { UPDATE_DASHBOARD } from '../actions/dashboard';
import { CONTRACT_STATE_VERIFIED, CONTRACT_STATE_FINISHED, CONTRACT_STATE_HALTED } from '../constants';

export default function(state = {current: [], finished: []}, action) {
  switch(action.type) {
    case RATE_CONTRACT:
      const feedback = action.feedback;
      const contract = state.finished.find(c => c._id === feedback.contract);
      if(contract) {
        const updated = {...contract, feedbacks: contract.feedbacks.concat(feedback)};
        return {...state, finished: state.finished.map(c => c._id === updated._id ? updated : c)};
      } else {
        return state;
      }
    case VERIFY_OFFER:
      return {...state, current: state.current.concat(action.offer)}
    case PAY_OFFER: {
      const offer = action.offer;
      const _id = makeId();
      const startDate = Date.now();
      const expireDate = offer.duration * 86400000 + startDate;
      const startBalance = offer.amount;
      const currentBalance = offer.amount;
      const contractor = offer.toUser[0].name;
      const { currency, keyId, fee, maxLoss } = offer;
      const left = Math.floor(startBalance * offer.roi / 100);
      const contract = {
        contractor,
        currency,
        state: CONTRACT_STATE_VERIFIED,
        expireDate,
        startDate,
        startBalance,
        currentBalance,
        left,
        maxLoss,
        fee,
        feedbacks: [],
        _id,
        keyId,
      };
      console.log(state);
      return {...state, current: state.current.concat(contract)};
    }
    case FETCH_CONTRACTS: {
      return action.contracts;
    }
    case UPDATE_CONTRACT_BALANCE: {
      const current = [...state.current];
      const contractIndex = current.findIndex(c => c._id === action._id);
      if(contractIndex < 0) {
        return state;
      }
      current[contractIndex].balances = action.balances;
      return {...state, current};
    }
    default:
      return state;
  }
}
