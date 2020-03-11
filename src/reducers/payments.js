import { reducerCreator } from 'generic/util';
import { UPDATE_MBN_ADDRESS } from 'actions/payments';
import { CREATE_PAYMENT_REQUEST } from 'actions/tariffs';

const initialState = {
  address: null,
  paymentRequest: null,
};

const reducerList = {
  [UPDATE_MBN_ADDRESS]: (state, { address }) => (
    Object.entries(address).length === 0
      ? state
      : { ...state, ...address }
  ),
  [CREATE_PAYMENT_REQUEST]: (state, { paymentRequest }) => ({ ...state, paymentRequest }),
};

export default reducerCreator(initialState, reducerList);
