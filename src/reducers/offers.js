import { combineReducers } from 'redux';

import { reducerCreator } from 'generic/util';
import {
  ACCEPT_OFFER, REJECT_OFFER, CANCEL_OFFER, SEND_OFFER,
  PAY_OFFER, NEW_OFFER, VERIFY_OFFER, TIMEOUT_OFFER,
} from 'actions/offers';
import { FETCH_CONTRACTS } from 'actions/contracts';

const incomingReducerList = {
  [CANCEL_OFFER]: (state, { userId, offer }) => (
    userId !== offer.to._id
      ? state
      : state.filter(o => o._id !== offer._id)
  ),
  [REJECT_OFFER]: (state, { userId, offer }) => (
    userId !== offer.to._id
      ? state
      : state.filter(o => o._id !== offer._id)
  ),
  [ACCEPT_OFFER]: (state, { userId, offer }) => (
    userId !== offer.to._id
      ? state
      : state.map(o => o._id === offer._id ? offer : o)
  ),
  [FETCH_CONTRACTS]: (_, { offers: { incoming } }) => incoming,
  [NEW_OFFER]: (state, { offer }) => [...state, offer],
  [TIMEOUT_OFFER]: (state, { offer }) => state.filter(o => o._id !== offer._id),
  [VERIFY_OFFER]: (state, { offer }) => state.filter(o => o._id !== offer._id),
};

const outgoingReducerList = {
  [FETCH_CONTRACTS]: (_, { offers: { outgoing } }) => outgoing,
  [REJECT_OFFER]: (state, { userId, offer }) => (
    userId !== offer.from._id
      ? state
      : state.filter(o => o._id !== offer._id)
  ),
  [CANCEL_OFFER]: (state, { userId, offer }) => (
    userId !== offer.from._id
      ? state
      : state.filter(o => o._id !== offer._id)
  ),
  [ACCEPT_OFFER]: (state, { userId, offer }) => (
    userId !== offer.from._id
      ? state
      : state.map(o => o._id === offer._id ? offer : o)
  ),
  [SEND_OFFER]: (state, { offer }) => [...state, offer],
  [TIMEOUT_OFFER]: (state, { offer }) => state.filter(o => o._id !== offer._id),
  [VERIFY_OFFER]: (state, { offer }) => state.filter(o => o._id !== offer._id),
  [PAY_OFFER]: (state, { offer }) => state.filter(o => o._id !== offer._id),
};

const incoming = reducerCreator([], incomingReducerList);
const outgoing = reducerCreator([], outgoingReducerList);

export default combineReducers({ incoming, outgoing });
