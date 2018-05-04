import { apiPost, ApiError } from '../generic/apiCall';
import defaultErrorHandler from '../generic/errorHandlers';
import { ABI, ADDRESS, MAIN_NET_ADDRESS } from '../eth/MercatusFactory';

export const ACCEPT_OFFER = 'ACCEPT_OFFER';
export const REJECT_OFFER = 'REJECT_OFFER';
export const CANCEL_OFFER = 'CANCEL_OFFER';
export const SEND_OFFER = 'SEND_OFFER';
export const PAY_OFFER = 'PAY_OFFER';


export function acceptOffer(offer) {
  return dispatch => {
    apiPost(`/contract/${offer._id}/accept`)
      .then(offer => {
        dispatch({
          type: ACCEPT_OFFER,
          offer
        });
      });
  };
}

export function cancelOffer(offer) {
  return dispatch => {
    apiPost(`/contract/${offer._id}/cancel`)
      .then(offer => {
        dispatch({
          type: CANCEL_OFFER,
          offer
        });
      });
  };
}

export function rejectOffer(offer) {
  return dispatch => {
    apiPost(`/contract/${offer._id}/reject`)
      .then(offer => dispatch({
        type: REJECT_OFFER,
        offer
      }));
  };
}

export function sendOffer(offer) {
  return dispatch => {
    apiPost('/contract', null, offer)
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
            case ApiError.WRONG_DEAL_TERMS:
              alert('Trader has changed contract settings, please reload page');
              break;
            default:
              defaultErrorHandler(err, dispatch);
          }
        }
        console.log(err);
        console.log(err.apiErrorCode);
      });
  };
}

function getSelectedNet() {
  return window.localStorage.getItem('selectedNet') || 'mainnet';
}

export function payOffer(offer) {
  return dispatch => {
    window.web3.version.getNetwork((err, code) => {
      if(err) {
        alert('web3 error: no network');
      } else {
        const selectedNet = getSelectedNet();
        if(selectedNet === 'mainnet' && code !== '1') {
          alert('Please select main net in Metamask');
        } else if(selectedNet === 'testnet' && code !== '3') {
          alert('Please select Ropsten network in Metamask');
        } else {
          window.web3.eth.getAccounts((err, accs) => {
            if(err) {
              alert('Metamask error: cannot get account');
            } else {
              const account = accs[0];
              if(!account) {
                alert('Unlock metamask');
                return;
              }
              const address = selectedNet === 'mainnet' ? MAIN_NET_ADDRESS : ADDRESS;
              sendTransaction(address, offer, selectedNet);
            }
          });
        }
      }
    });
  };
}


function sendTransaction(address, offer, selectedNet) {
  const contract = window.web3.eth.contract(ABI).at(address);
  const {contractSettings: {duration, currency, maxLoss, amount, startBalance, targetBalance}, _id} = offer;
  const investor = offer.from.name;
  const investorAddress = offer.from.address;
  const trader = offer.to.name;
  const traderAddress = offer.to.address;
  let contractCurrency;
  switch(currency) {
    case 'ETH':
      contractCurrency = 2;
      break;
    case 'BTC':
      contractCurrency = 1;
      break;
    case 'USDT':
      contractCurrency = 0;
      break;
    default:
      alert(offer.currency + ' not supported for contract yet');
      return;
  }
  console.log(duration, maxLoss, startBalance, targetBalance, amount, investor, investorAddress, trader, traderAddress, '0x' + _id, contractCurrency);
  console.log({value: amount});
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
    contractCurrency,{value: amount},  (err, tx) => {
      if(err) {
        return;
      } else {
        let txUrl;
        switch(selectedNet) {
          case 'mainnet':
            txUrl = 'https://etherscan.io/tx/' + tx;
            break;
          case 'testnet':
            txUrl = 'https://ropsten.etherscan.io/tx/' + tx;
            break;
          default:
            throw new Error(`unkown selected net: ${selectedNet}`);
        }
        alert('You have sent transaction to pay this request.' +
          ' If transaction completes succesfully you will receive the contract.' +
          ' Check the transaction status in metamask or here: ' +
          txUrl + '\nDo not pay this request again, if the transaction has not completed yet');
      }
    });
}
