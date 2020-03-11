import { makeId, reducerCreator } from 'generic/util';
import { CONTRACT_STATE_VERIFIED } from '../constants';
import {
  RATE_CONTRACT, FETCH_CONTRACTS, UPDATE_CONTRACT_BALANCE,
  FINISH_CONTRACT, UPDATE_CONTRACT_TOTAL_BALANCE,
} from 'actions/contracts';
import { PAY_OFFER, VERIFY_OFFER } from 'actions/offers';

const initialState = { current: [], finished: [] };

const reducerList = {
  [RATE_CONTRACT]: (state, { feedback }) => {
    const contract = state.finished.find(c => c._id === feedback.contract);

    if (contract) {
      const updated = { ...contract, feedbacks: contract.feedbacks.concat(feedback) };
      return { ...state, finished: state.finished.map(c => c._id === updated._id ? updated : c) };
    } else {
      return state;
    }
  },
  [VERIFY_OFFER]: (state, { offer }) => ({ ...state, current: [offer, ...state.current] }),
  [PAY_OFFER]: (state, { offer }) => {
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
  },
  [FETCH_CONTRACTS]: (_, { contracts }) => contracts,
  [FINISH_CONTRACT]: (state, { contract }) => {
    const newState = {};
    const current = state.current.filter(c => c._id !== contract._id);
    newState.current = current;
    const hasInFinished = state.finished.find(c => c._id === contract._id);
    if(!hasInFinished) {
      newState.finished = state.finished.concat(contract);
    } else {
      newState.finished = state.finished;
    }
    return newState;
  },
  [UPDATE_CONTRACT_BALANCE]: (state, { _id, balances }) => {
    const contract = state.current.find((c) => c._id === _id);
    if (!contract) { return state; }

    const updated = {...contract, balances };
    return {
      ...state,
      current: state.current.map((c) => c._id === contract._id ? updated : c ),
    };
  },

  [UPDATE_CONTRACT_TOTAL_BALANCE]: (state, { _id, total }) => {
    const contract = state.current.find(c => c._id === _id);

    if (contract && contract.totalInBTC !== total) {
      return {
        ...state,
        current: state.current.map(c => (
          c._id === _id ? { ...c, totalInBTC: total } : c
        ))
      };
    }
    return state;
  },
};

export default reducerCreator(initialState, reducerList);
