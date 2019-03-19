import {RATE_CONTRACT, FETCH_CONTRACTS, UPDATE_CONTRACT_BALANCE, FINISH_CONTRACT, UPDATE_CONTRACT_TOTAL_BALANCE} from '../actions/contracts';
import {PAY_OFFER, VERIFY_OFFER} from '../actions/offers';
import { makeId } from '../generic/util';
import { CONTRACT_STATE_VERIFIED } from '../constants';

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
      return {...state, current: [action.offer, ...state.current]};
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
      return {...state, current: state.current.concat(contract)};
    }
    case FETCH_CONTRACTS: {
      return action.contracts;
    }
    case FINISH_CONTRACT: {
      const newState = {};
      const contract = action.contract;
      const current = state.current.filter(c => c._id !== contract._id);
      newState.current = current;
      const hasInFinished = state.finished.find(c => c._id === contract._id);
      if(!hasInFinished) {
        newState.finished = state.finished.concat(contract);
      } else {
        newState.finished = state.finished;
      }
      return newState;
    }
    case UPDATE_CONTRACT_BALANCE: {
      const contract = state.current.find((c) => c._id === action._id);
      if (!contract) {
        return state;
      }
      const updated = {...contract, balances: action.balances };
      return {...state, current: state.current.map((c) => {
        if (c._id === contract._id) {
          return updated;
        } else {
          return c;
        }
      })};
    }
    case UPDATE_CONTRACT_TOTAL_BALANCE: {
      const contract = state.current.find(c => c._id === action._id);
      if(contract && contract.totalInBTC !== action.total) {
        const current = state.current.map(c => {
          if(c._id === action._id) {
            return {...c, totalInBTC: action.total};
          } else {
            return c;
          }
        });
        return {...state, current};
      }
      return state;
    }
    default:
      return state;
  }
}
