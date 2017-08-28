import { LOGGED_IN, LOGGED_OUT, NAME_REQUIRED, SET_NICKNAME } from '../actions/auth';

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
    case NAME_REQUIRED: {
      const state = {nameRequired: true, loggedIn: false};
      localStorage.setItem('reduxState', JSON.stringify({auth: state}));
      return state;
    }
    case SET_NICKNAME: {
      const name = action.name;
      const state = {loggedIn: true, userId: name};
      localStorage.setItem('reduxState', JSON.stringify({auth: state}));
      return state;
    }
    default:
      return auth;
  }
}
