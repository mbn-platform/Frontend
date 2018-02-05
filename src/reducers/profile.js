import { GET_PROFILE, UPDATE_PROFILE } from '../actions/profile';

export default function(state = {}, action) {
  switch(action.type) {
    case GET_PROFILE:
      return action.profile;
    case UPDATE_PROFILE:
      const {availableForOffers, fee, minAmount, roi, minAmountCurrency, duration, maxLoss, currencies} = action.profile;
      return {...state, availableForOffers, fee, minAmount, roi, minAmountCurrency, duration, maxLoss, currencies};
    default:
      return state;
  }
}
