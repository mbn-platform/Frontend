import {RATE_CONTRACT } from '../actions/contracts';
import { PAY_OFFER } from '../actions/offers';
import { makeId } from '../generic/util';
import { UPDATE_DASHBOARD } from '../actions/dashboard';
import { CONTRACT_STATE_VERIFIED, CONTRACT_STATE_FINISHED, CONTRACT_STATE_HALTED } from '../constants';

export default function(state = {current: [], finished: []}, action) {
  switch(action.type) {
    case RATE_CONTRACT:
      const feedback = action.feedback;
      const name = action.userId;
      const date = (new Date(action.time)).toISOString();
      const f = {
        name,
        date,
        raiting: feedback.rate,
        text: feedback.text,
      };
      const contract = state.finished.find(c => c._id === feedback.offerId);
      const updated = {...contract, feedbacks: contract.feedbacks.concat(f)};
      return {...state, finished: state.finished.map(c => c._id === updated._id ? updated : c)};
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
    case UPDATE_DASHBOARD: {
      const offers = [...action.data.offers.incoming, ...action.data.offers.outgoing];
      const current = offers.filter(o => o.state === CONTRACT_STATE_VERIFIED);
      const finished = offers.filter(o => o.state === CONTRACT_STATE_HALTED || o.state === CONTRACT_STATE_FINISHED);
      return {current, finished};
    }
    default:
      return state;
  }
}
