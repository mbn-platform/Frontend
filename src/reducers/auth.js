import { LOGGED_IN } from '../actions/auth';

export default function reducer(auth = {}, action) {
  switch(action.type) {
    case LOGGED_IN:
      localStorage.setItem('reduxState', JSON.stringify({auth: {loggedIn: true}}));
      return {loggedIn: true};
    default:
      return auth;
  }
}
