import { LOGGED_IN, LOGGED_OUT, NAME_REQUIRED } from '../actions/auth';
import { UPDATE_PROFILE } from '../actions/profile';

export default function reducer(auth = {}, action) {
  switch(action.type) {
    case LOGGED_IN: {
      const state = {loggedIn: true, profile: action.data};
      localStorage.setItem('reduxState', JSON.stringify({auth: state}));
      return state;
    }
    case LOGGED_OUT: {
      localStorage.setItem('reduxState', JSON.stringify({auth: {loggedIn: false}}));
      return {loggedIn: false};
    }
    case NAME_REQUIRED: {
      const state = {nameRequired: true, loggedIn: false};
      localStorage.setItem('reduxState', JSON.stringify({auth: state}));
      return state;
    }
    case UPDATE_PROFILE: {
      console.log(action);
      const profile = action.profile;
      const currentProfile = auth.profile;
      const update = {...currentProfile, ...profile};
      let currencies = action.profile.currencies;
      if(currencies !== currentProfile.currencies) {
        currencies.forEach(c => {
          const current = currentProfile.currencies;
          const cc = current.find(c1 => c1.name === c.name);
          if(!cc) {
            return;
          };
          c.tradeVolume = cc.tradeVolume;
          c.roi = cc.roi;
        });
        update.currencies = currencies;
      }
      return {...auth, profile: update};
    }
    default:
      return auth;
  }
}
