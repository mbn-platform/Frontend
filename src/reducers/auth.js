import { LOGGED_IN } from '../actions/auth';

export default function reducer(auth = {}, action) {
  switch(action.type) {
    case LOGGED_IN:
      return {loggedIn: true};
    default:
      return auth;
  }
}
