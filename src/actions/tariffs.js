import defaultErrorHandler from '../generic/errorHandlers';
import { ApiTariffs } from '../generic/api';
import { ApiError } from '../generic/apiCall';
import { showInfoModal } from './modal';
import '../eth/MembranaToken';

const TariffsApi = new ApiTariffs();

export const UPDATE_TARIFFS = 'UPDATE_TARIFFS';
export const UPDATE_TARIFF_BY_ID = 'UPDATE_TARIFF_BY_ID';

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

export function paymentRequest(id, to) {
  const { web3, mbnTransfer } = window;

  return dispatch =>
    TariffsApi.paymentRequest(id)
      .then(json =>
        mbnTransfer(web3, to, json.amount)
          .then(res => console.log('res', res))
          .catch(err => console.log('err', err))
      )
      .catch(err => {
        if(err.apiErrorCode) {
          switch(err.apiErrorCode) {
            case ApiError.INVALID_PARAMS_SET:
              dispatch(showInfoModal('tariffs.errors.unableToBuyFree'));
              break;
            case ApiError.UNIQUE_VIOLATION: {
              dispatch(showInfoModal('tariffs.errors.addressNotGenerated'));
              break;
            }
            default:
              defaultErrorHandler(err, dispatch);
          }
        }
      });
}
