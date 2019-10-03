import { UPDATE_MBN_ADDRESS } from '../actions/payments';
import { CREATE_PAYMENT_REQUEST } from '../actions/tariffs';

const INITIAL_STATE = {
  address: null,
  paymentRequest: null,
};

export default (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case UPDATE_MBN_ADDRESS:
      const { address } = action;
      if (Object.entries(address).length === 0) {
        return state;
      }
      return { ...state, ...address };
    case CREATE_PAYMENT_REQUEST:
    const { paymentRequest } = action;
      return { ...state, paymentRequest };
    default:
      return state;
  }
}
