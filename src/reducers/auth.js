import { LOGGED_IN, LOGGED_OUT } from '../actions/auth';

export default function reducer(auth = {}, action) {
  switch(action.type) {
    case LOGGED_IN:
      const state = {loggedIn: true, userId: action.data._id};
      localStorage.setItem('reduxState', JSON.stringify({auth: state}));
      return state;
    case LOGGED_OUT:
      localStorage.setItem('reduxState', JSON.stringify({auth: {loggedIn: false}}));
      return {loggedIn: false}
    default:
      return auth;
  }
}
