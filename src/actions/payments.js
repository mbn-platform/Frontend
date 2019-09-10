import { ApiPayments } from '../generic/api';
import { showInfoModal } from './modal';

const namespace = 'payments';
export const TRANSFER_TOKEN_AMOUNT = `${namespace}/TRANSFER_TOKEN_AMOUNT`;

const PaymentsApi = new ApiPayments(window.web3);

export const transferTokenAmounts = (destination, amount) => {
  return async (dispatch, getState) => {
    PaymentsApi.transferTokens(destination, amount)
      .then((result) => {
        console.log('result', result);
      })
      .catch((err) => {
        if (err.code) {
          dispatch(showInfoModal('modal.error.transactionDenied'));
        } else {
          dispatch(showInfoModal('simpleValue', { value: err.message }));
        }
      });
  };
};
