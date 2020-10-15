import defaultErrorHandler from '../generic/errorHandlers';
import { ApiTariffs } from '../generic/api';
import { ApiError } from '../generic/apiCall';
import { addQuickNotif } from './quickNotif';
import '../eth/MembranaToken';

const TariffsApi = new ApiTariffs();

export const UPDATE_TARIFFS = 'UPDATE_TARIFFS';
export const UPDATE_TARIFF_BY_ID = 'UPDATE_TARIFF_BY_ID';
export const CREATE_PAYMENT_REQUEST = 'CREATE_PAYMENT_REQUEST';

export function fetchTariffs() {
  return dispatch => {
    TariffsApi.fetch()
      .then(json => dispatch({
        type: UPDATE_TARIFFS,
        tariffs: json,
      }))
      .catch(err => {
        defaultErrorHandler(err, dispatch);
      });
  };
}

export function getTariffById(id) {
  return dispatch => {
    TariffsApi.getTariffById(id)
      .then(json => dispatch({
        type: UPDATE_TARIFF_BY_ID,
        tariff: json,
      }))
      .catch(err => {
        defaultErrorHandler(err, dispatch);
      });
  };
}

export function createPaymentRequest(id) {
  return dispatch =>
    TariffsApi.paymentRequest(id)
      .then(json => dispatch({
        type: CREATE_PAYMENT_REQUEST,
        paymentRequest: json,
      }))
      .catch(err => {
        if(err.apiErrorCode) {
          switch(err.apiErrorCode) {
            case ApiError.INVALID_PARAMS_SET:
              dispatch(addQuickNotif({
                type: 'error',
                object: {
                  text: 'tariffs.errors.unableToBuyFree',
                  _id: 'tariffs.errors.unableToBuyFree',
                },
              }));
              break;
            case ApiError.UNIQUE_VIOLATION: {
              dispatch(addQuickNotif({
                type: 'error',
                object: {
                  text: 'tariffs.errors.addressNotGenerated',
                  _id: 'tariffs.errors.addressNotGenerated',
                },
              }));
              break;
            }
            default:
              defaultErrorHandler(err, dispatch);
          }
        }
      });
}

export function mbnTransfer() {
  return (_, getState) => {
    const { paymentRequest: { amount, address }} = getState().payments;
    if (address && amount) {
      window.mbnTransfer(window.web3, address, amount)
        .then(res => console.log('res', res))
        .catch(err => console.log('err', err));
    }
  };
}

export function ethTransfer(to, amount) {
  return (dispatch) => {
    return new Promise((res, rej) => {
      window.web3.eth.sendTransaction({
        to,
        value: amount,
      }, (err, tx) => {
        if (err) {
          rej(err);
        } else {
          res(tx);
        }
      });
    });
  };
}
window.ethTransfer = ethTransfer;
