import { ApiError } from '../generic/apiCall';
import defaultErrorHandler from '../generic/errorHandlers';
import { ApiOffers } from '../generic/api';
import { showInfoModal, showUpgradeTariffModal } from './modal';

export const ACCEPT_OFFER = 'ACCEPT_OFFER';
export const REJECT_OFFER = 'REJECT_OFFER';
export const CANCEL_OFFER = 'CANCEL_OFFER';
export const SEND_OFFER = 'SEND_OFFER';
export const VERIFY_OFFER = 'VERIFY_OFFER';
export const PAY_OFFER = 'PAY_OFFER';
export const NEW_OFFER = 'NEW_OFFER';
export const TIMEOUT_OFFER = 'TIMEOUT_OFFER';

const OffersApi = new ApiOffers(window.web3);

export function acceptOffer(offer) {
  return dispatch => {
    OffersApi.accept(offer)
      .then(offer => {
        dispatch({
          type: ACCEPT_OFFER,
          offer
        });
      })
      .catch(err => {
        if(err.apiErrorCode) {
          switch(err.apiErrorCode) {
            case ApiError.TARIFF_LIMIT:
              dispatch(showUpgradeTariffModal('profile.needToUpgradePlan',
                {},
                {
                  upgradeTariffText: 'profile.upgrade',
                  cancelText: 'profile.cancel',
                },
              ));
              break;
            default:
              defaultErrorHandler(err, dispatch);
          }
        }
      });
  };
}

export function cancelOffer(offer) {
  return dispatch => {
    OffersApi.cancel(offer)
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
    OffersApi.reject(offer)
      .then(offer => dispatch({
        type: REJECT_OFFER,
        offer
      }));
  };
}

export function sendOffer(offer) {
  return dispatch =>
    OffersApi.send(offer)
      .catch(err => {
        if(err.apiErrorCode) {
          switch(err.apiErrorCode) {
            case ApiError.WRONG_MIN_AMOUNT: {
              dispatch(showInfoModal('yourApiKeyBalanceIsLowerThatTraderMinimum'));
              break;
            }
            case ApiError.WRONG_DEAL_TERMS:
              dispatch(showInfoModal('traderHasChangedContractSettings'));
              break;
            case ApiError.INSUFFICIENT_FUNDS:
              dispatch(showInfoModal('errorInsufficientFunds'));
              break;
            case ApiError.TRADER_NOT_AVAILABLE:
              dispatch(showInfoModal('errorTraderNotAvailable'));
              break;
            case ApiError.TARIFF_LIMIT:
              dispatch(showUpgradeTariffModal('profile.needToUpgradePlan',
                {},
                {
                  upgradeTariffText: 'profile.upgrade',
                  cancelText: 'profile.cancel',
                },
              ));
              break;
            default:
              defaultErrorHandler(err, dispatch);
          }
        }
      });
}

export function payOffer(offer) {
  return () =>
    OffersApi.pay(offer);
};
