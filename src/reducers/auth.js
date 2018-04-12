import { LOGGED_IN, NAME_REQUIRED } from '../actions/auth';
import { UPDATE_PROFILE, GET_PROFILE } from '../actions/profile';
import {saveReduxState} from '../rootReducer';

export default function reducer(auth = {}, action) {
  switch(action.type) {
    case LOGGED_IN: {
      const state = {...auth, loggedIn: true, profile: action.data};
      saveReduxState({auth: state});
      return state;
    }
    case NAME_REQUIRED: {
      const state = {...auth, nameRequired: true, loggedIn: false};
      saveReduxState({auth: state});
      return state;
    }
    case GET_PROFILE: {
      const profile = action.profile;
      if(auth.loggedIn && auth.profile._id === profile._id) {
        const state = {...auth, profile};
        saveReduxState({auth: state});
        return state;
      }
      return auth;
    }
    case UPDATE_PROFILE: {
      if(!auth.loggedIn) {
        return auth;
      }
      const {available, contractSettings, currencies} = action.profile;
      const currentProfile = auth.profile;
      const update = {...currentProfile, available, contractSettings, currencies
      };
      const state = {...auth, profile: update};
      saveReduxState({auth: state});
      return state;
    }
    default:
      return auth;
  }
}
