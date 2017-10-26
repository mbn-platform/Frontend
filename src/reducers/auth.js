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
      return {loggedIn: false}
    }
    case NAME_REQUIRED: {
      const state = {nameRequired: true, loggedIn: false};
      localStorage.setItem('reduxState', JSON.stringify({auth: state}));
      return state;
    }
    case UPDATE_PROFILE: {
      console.log(action);
      const profile = action.profile;
      return {...auth, profile};
    }
    default:
      return auth;
  }
}
