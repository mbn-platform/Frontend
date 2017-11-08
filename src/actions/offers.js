import { apiPost, apiDelete } from '../generic/apiCall';
import { ABI, ADDRESS } from '../eth/MercatusFactory';

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
export function payOffer(offer) {
  return dispatch => {
    window.web3.version.getNetwork((err, code) => {
      if(err) {
        alert('web3 error: no network');
      } else {
        switch(code) {
          case '3':
            const contract = window.web3.eth.contract(ABI).at(ADDRESS);
            const traderAddress = offer.toUser[0].addr;
            const investorAddress = offer.fromUser[0].addr;
            window.web3.eth.getAccounts((err, accs) => {
              if(err) {
                alert('Metamask error: cannot get account');
              } else {
                const account = accs[0];
                if(!account) {
                  alert('unlock metamask');
                  return;
                }
                const toWei = window.web3.toWei;
                const deadline = Math.floor((new Date(offer.date)).getTime() / 1000) + offer.duration * 86400;
                alert('not implemented yet');
              }
            });
            break;
          default:
            alert('Mercatus is in test mode, please select Ropsten network in Metamask');
        }
      }
    });
  }
}

