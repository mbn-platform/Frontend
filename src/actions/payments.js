import defaultErrorHandler from '../generic/errorHandlers';
import { ApiPayments } from '../generic/api';
import { ApiError } from '../generic/apiCall';
import { showInfoModal } from './modal';

export const UPDATE_MBN_ADDRESS = 'UPDATE_MBN_ADDRESS';

const PaymentsApi = new ApiPayments();

export function getMbnAddress() {
  return (dispatch, getState) => {
    const name = getState().auth.profile.name;
    PaymentsApi.getMbnAddress(name)
      .then((address) => dispatch({
        type: UPDATE_MBN_ADDRESS,
        address,
      }))
      .catch(err => {
        defaultErrorHandler(err, dispatch);
      });
  };
}

export function createMbnAddress() {
  return (dispatch, getState) => {
    const name = getState().auth.profile.name;
    PaymentsApi.createMbnAddress(name)
      .then((address) => dispatch({
        type: UPDATE_MBN_ADDRESS,
        address,
      }))
      .catch(err => {
        if(err.apiErrorCode) {
          switch(err.apiErrorCode) {
            case ApiError.UNIQUE_VIOLATION: {
              dispatch(showInfoModal('payments.errors.addressAlreadyExists'));
              break;
            }
            default:
              defaultErrorHandler(err, dispatch);
          }
        }
      });
  };
}
