import { LOGGED_IN, NAME_REQUIRED } from '../actions/auth';
import { UPDATE_PROFILE, UPDATE_PROFILE_AVAILABLE, GET_PROFILE } from '../actions/profile';

export default function reducer(auth = {}, action) {
  switch(action.type) {
    case LOGGED_IN: {
      const state = {...auth, loggedIn: true, profile: action.data};
      return state;
    }
    case NAME_REQUIRED: {
      const state = {...auth, nameRequired: true, loggedIn: false};
      return state;
    }
    case GET_PROFILE: {
      const profile = action.profile;
      if(auth.loggedIn && auth.profile._id === profile._id) {
        const state = {...auth, profile: {...auth.profile, ...profile}};
        return state;
      }
      return auth;
    }
    case UPDATE_PROFILE_AVAILABLE: {
      if(!auth.loggedIn) {
        return auth;
      }
      const {available, contractSettings, currencies} = action.profile;
      const currentProfile = auth.profile;
      const update = {...currentProfile, available, contractSettings, currencies
      };
      const state = {...auth, profile: update};
      return state;
    }

    case UPDATE_PROFILE: {
      const profile = action.profile;

      return { ...auth, profile: { ...auth.profile, ...profile }};
    }
    default:
      return auth;
  }
}
