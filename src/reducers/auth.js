import { LOGGED_IN, LOGGED_OUT, SET_NICKNAME } from '../actions/auth';

export default function reducer(auth = {}, action) {
  switch(action.type) {
    case LOGGED_IN: {
      const { _id: userId, isNew } = action.data;
      const state = {loggedIn: true, userId, isNew};
      localStorage.setItem('reduxState', JSON.stringify({auth: state}));
      return state;
    }
    case LOGGED_OUT: {
      localStorage.setItem('reduxState', JSON.stringify({auth: {loggedIn: false}}));
      return {loggedIn: false}
    }
    case SET_NICKNAME: {
      const nickname = action.nickname;
      const state = {...auth, loggedIn: true, isNew: false};
      localStorage.setItem('reduxState', JSON.stringify({auth: state}));
      return state;
    }
    default:
      return auth;
  }
}
