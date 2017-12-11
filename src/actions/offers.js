import { apiPost, apiDelete } from '../generic/apiCall';
import { ABI, ADDRESS } from '../eth/MercatusFactory';
import { makeId } from '../generic/util';

export const ACCEPT_OFFER = 'ACCEPT_OFFER';
export const REJECT_OFFER = 'REJECT_OFFER';
export const CANCEL_OFFER = 'CANCEL_OFFER';
export const SEND_OFFER = 'SEND_OFFER';
export const PAY_OFFER = 'PAY_OFFER';


export function acceptOffer(offer) {
  return {
    type: ACCEPT_OFFER,
    offer
  };
}

export function cancelOffer(offer) {
  return {
    type: CANCEL_OFFER,
    offer
  };
}

export function rejectOffer(offer) {
  return {
    type: REJECT_OFFER,
    offer
  };
}

export function sendOffer(offer) {
  return {
    type: SEND_OFFER,
    offer
  }
}
export function payOffer(offer) {
  return {
    type: PAY_OFFER,
    offer
  };
}

