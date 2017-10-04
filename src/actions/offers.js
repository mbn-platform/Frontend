import { apiPost } from '../generic/apiCall';

export const ACCEPT_OFFER = 'ACCEPT_OFFER';
export const REJECT_OFFER = 'REJECT_OFFER';
export const CANCEL_OFFER = 'CANCEL_OFFER';
export const SEND_OFFER = 'SEND_OFFER';


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
  return dispatch => {
    apiPost('/api/offer', {body: JSON.stringify(offer)}, dispatch)
      .then(json => {
        if(json._id) {
          dispatch({
            type: SEND_OFFER,
            offer: json
          });
        }
      });
  };
}
