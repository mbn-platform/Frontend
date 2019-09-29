import { UPDATE_MBN_ADDRESS } from '../actions/payments';

export default (state = { address: null }, action) => {
  switch(action.type) {
    case UPDATE_MBN_ADDRESS:
      const { address } = action;
      if (Object.entries(address).length === 0) {
        return state;
      }
      return address;
    default:
      return state;
  }
}
