import { ApiError } from '../generic/apiCall';
import { ApiAuth } from '../generic/api';
import { showInfoModal } from './modal';


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
      }, (error) => {
        dispatch(showInfoModal('simpleValue', {value : error.code}));
      });
  };
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
              dispatch(showInfoModal('invalidName'));
              return;
            case ApiError.UNIQUE_VIOLATION:
              dispatch(showInfoModal('youCannotUseThatName'));
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



