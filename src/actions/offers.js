export const ACCEPT_OFFER = 'ACCEPT_OFFER';
export const REJECT_OFFER = 'REJECT_OFFER';
export const CANCEL_OFFER = 'CANCEL_OFFER';


export function acceptOffer(offer) {
  return dispatch => {
    window.fetch('/api/offer/accept/', {
      method: 'post',
      body: JSON.stringify(offer)
    }).then(res => res.json)
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
    window.fetch('/api/offer/cancel', {
      method: 'post',
      body: JSON.stringify(offer)
    }).then(res => res.json())
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
    window.fetch('/api/offer/reject', {
      method: 'post',
      body: JSON.stringify(offer)
    }).then(res => res.json())
      .then(json => {
        dispatch({
          type: REJECT_OFFER,
          offer
        });
      });
  };
}
