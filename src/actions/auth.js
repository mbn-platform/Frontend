import { ApiError } from '../generic/apiCall';
import { ApiAuth } from '../generic/api';


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
        alert(error.code);
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
              alert('Invalid name');
              return;
            case ApiError.UNIQUE_VIOLATION:
              alert('You cannot use that name, please enter another one');
              break;
            default:
              console.log('unhandled api error');
          }
        } else {
          console.log('failed to log in', e.description);
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



