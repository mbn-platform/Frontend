import { apiPost, apiDelete, ApiError } from '../generic/apiCall';
import defaultErrorHandler from '../generic/defaultErrorHandler';
import { ABI, ADDRESS } from '../eth/MercatusFactory';

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
  return dispatch => {
    apiPost('/api/offer', null, offer)
      .then(json => {
        dispatch({
          type: SEND_OFFER,
          offer: json
        });
      })
      .catch(err => {
        if(err.apiErrorCode) {
          switch(err.apiErrorCode) {
            case ApiError.WRONG_MIN_AMOUNT: {
              alert('Your api key balance is lower that trader\'s minmum contract amount');
              break;
            }
            default:
              defaultErrorHandler(err, dispatch);
          }
        }
        console.log(err);
        console.log(err.apiErrorCode);
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
            window.web3.eth.getAccounts((err, accs) => {
              if(err) {
                alert('Metamask error: cannot get account');
              } else {
                const account = accs[0];
                if(!account) {
                  alert('unlock metamask');
                  return;
                }
                const { duration, maxLoss, startBalance, targetBalance, amount, _id } = offer;
                const investor = offer.fromUser[0].name;
                const investorAddress = offer.fromUser[0].addr;
                const trader = offer.toUser[0].name;
                const traderAddress = offer.toUser[0].addr;
                let currency;
                switch(offer.currency) {
                  case 'ETH':
                    currency = 2;
                    break;
                  case 'BTC':
                    currency = 1;
                    break;
                  case 'USDT':
                    currency = 0;
                    break;
                  default:
                    alert(offer.currency + ' not supoorted for contract yet');
                    return;
                }
                contract.makeDeal(
                  duration,
                  maxLoss,
                  startBalance,
                  targetBalance,
                  amount,
                  investor,
                  investorAddress,
                  trader,
                  traderAddress,
                  '0x' + _id,
                  currency,{value: amount},  (err, tx) => {
                    if(err) {
                      return;
                    } else {
                      alert('You have sent transaction to pay this request. If transaction completes succesfully you will receive the contract. Check the transaction status in metamask or here: https://ropsten.etherscan.io/tx/' + tx + '\nDo not pay this request again, if the transaction has not completed yet');
                    }
                  });

              }
            });
            break;
          default:
            alert('Mercatus is in test mode, please select Ropsten network in Metamask');
        }
      }
    });
  };
}

