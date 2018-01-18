import { apiPost, apiDelete } from '../generic/apiCall';
import { ABI, ADDRESS } from '../eth/MercatusFactory';
import { makeId } from '../generic/util';

export const ACCEPT_OFFER = 'ACCEPT_OFFER';
export const REJECT_OFFER = 'REJECT_OFFER';
export const CANCEL_OFFER = 'CANCEL_OFFER';
export const SEND_OFFER = 'SEND_OFFER';
export const PAY_OFFER = 'PAY_OFFER';


export function acceptOffer(offer) {
  return dispatch => {
    apiPost(`/api/offer/${offer._id}/accept`)
      .then(json => {
        dispatch({
          type: ACCEPT_OFFER,
          offer
        });
      });
  };
}

export function cancelOffer(offer) {
  return dispatch => {
    apiDelete(`/api/offer/${offer._id}`)
      .then(json => {
        dispatch({
          type: CANCEL_OFFER,
          offer
        });
      });
  };
}

export function rejectOffer(offer) {
  return dispatch => {
    apiPost(`/api/offer/${offer._id}/reject`)
      .then(json => {
        if(json.offerId) {
          dispatch({
            type: REJECT_OFFER,
            offer
          });
        }
      });
  };
}

export function sendOffer(offer) {
  console.log(offer);
  return dispatch => {
    apiPost('/api/offer', null, offer)
      .then(json => {
        dispatch({
          type: SEND_OFFER,
          offer: json
        });
      })
      .catch(err => {
        console.log(err);
        console.log(err.apiErrorCode);
      });
  };
}

export function payOffer(offer) {
  return {
    type: PAY_OFFER,
    offer
  };
}

