import { apiPost, apiDelete } from '../generic/apiCall';

export const ACCEPT_OFFER = 'ACCEPT_OFFER';
export const REJECT_OFFER = 'REJECT_OFFER';
export const CANCEL_OFFER = 'CANCEL_OFFER';
export const SEND_OFFER = 'SEND_OFFER';


export function acceptOffer(offer) {
  return dispatch => {
    apiPost(`/api/offer/${offer._id}/accept`, null, dispatch)
      .then(json => {
        if(json.offerId) {
          dispatch({
            type: ACCEPT_OFFER,
            offer
          });
        }
      });
  };
}

export function cancelOffer(offer) {
  return dispatch => {
    apiDelete(`/api/offer/${offer._id}`, dispatch)
      .then(json => {
        if(json.result) {
          dispatch({
            type: CANCEL_OFFER,
            offer
          });
        }
      });
  };
}

export function rejectOffer(offer) {
  return dispatch => {
    apiPost(`/api/offer/${offer._id}/reject`, null, dispatch)
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
