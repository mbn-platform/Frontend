import { ApiError } from '../generic/apiCall';
import { ApiAuth } from '../generic/api';
import { addQuickNotif } from './quickNotif';
import qs from 'qs';

export const LOGGED_OUT = 'LOGGED_OUT';
export const LOGGED_IN = 'LOGGED_IN';
export const NAME_REQUIRED = 'NAME_REQUIRED';

const AuthApi = new ApiAuth(window.web3);

export function logIn() {
  return dispatch => {
    AuthApi.logIn()
      .then((profile) => {
        if (! profile.name) {
          dispatch(nameRequiredAction());
        } else {
          dispatch(loggedIn(profile));
        }
      })
      .catch(error => {
        error.code && dispatch(addQuickNotif({
          type: 'error',
          object: {
            text: 'simpleValue',
            _id: 'simpleValue',
            values: {value: error.code},
          },
        }));
      });
  };
}

export function redirectToAuthorization(redirectTo = '', replace = false) {
  const params = {
  };
  if (redirectTo) {
    params.redirectTo = redirectTo;
  }
  const redirectUrl = `${process.env.REACT_APP_SIGN_IN_LANDING}?${qs.stringify(params)}`;
  if (replace) {
    window.location.replace(redirectUrl);
  } else {
    window.location.href = redirectUrl;
  }
}

export function addName(name) {
  return dispatch => {
    AuthApi.addName(name)
      .then(response => {
        dispatch(loggedIn(response));
      })
      .catch(e => {
        if(e.apiErrorCode) {
          switch(e.apiErrorCode) {
            case ApiError.FORBIDDEN:
              dispatch({
                type: 'LOGGED_OUT',
              });
              break;
            case ApiError.INVALID_PARAMS_SET:
              dispatch(addQuickNotif({
                type: 'error',
                object: {
                  text: 'invalidName',
                  _id: 'invalidName',
                },
              }));
              return;
            case ApiError.UNIQUE_VIOLATION:
              dispatch(addQuickNotif({
                type: 'error',
                object: {
                  text: 'youCannotUseThatName',
                  _id: 'youCannotUseThatName',
                },
              }));
              break;
            default:
              console.error('unhandled api error');
          }
        } else {
          console.error('failed to log in', e.description);
        }
      });
  };
}

function nameRequiredAction() {
  return {
    type: NAME_REQUIRED
  };
}

export function loggedOut() {
  AuthApi.logout();
  return {
    type: LOGGED_OUT,
  };
}

export function loggedIn(data) {
  return {
    type: LOGGED_IN,
    data
  };
}



