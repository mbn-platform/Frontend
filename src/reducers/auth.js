import { LOGGED_IN, NAME_REQUIRED } from '../actions/auth';
import { UPDATE_PROFILE, GET_PROFILE } from '../actions/profile';

export default function reducer(auth = {}, action) {
  switch(action.type) {
    case LOGGED_IN: {
      const state = {loggedIn: true, profile: action.data};
      localStorage.setItem('reduxState', JSON.stringify({auth: state}));
      return state;
    }
    case NAME_REQUIRED: {
      const state = {nameRequired: true, loggedIn: false};
      localStorage.setItem('reduxState', JSON.stringify({auth: state}));
      return state;
    }
    case GET_PROFILE: {
      const profile = action.profile;
      if(auth.loggedIn && auth.profile._id === profile._id) {
        const state = {...auth, profile};
        localStorage.setItem('reduxState', JSON.stringify({auth: state}));
        return state;
      }
      return auth;
    }
    case UPDATE_PROFILE: {
      if(!auth.loggedIn) {
        return auth;
      }
      const {availableForOffers, fee, minAmount, roi, minAmountCurrency, duration, maxLoss, currencies} = action.profile;
      const currentProfile = auth.profile;
      const update = {...currentProfile, availableForOffers, fee,
        minAmount, roi, minAmountCurrency, duration,
        maxLoss, currencies,
      };
      const state = {...auth, profile: update};
      localStorage.setItem('reduxState', JSON.stringify({auth: state}));
      return state;
    }
    default:
      return auth;
  }
}
