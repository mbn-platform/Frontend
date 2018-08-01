import { apiPost, ApiError } from '../generic/apiCall';

export const LOGGED_OUT = 'LOGGED_OUT';
export const LOGGED_IN = 'LOGGED_IN';
export const NAME_REQUIRED = 'NAME_REQUIRED';
export const SET_NICKNAME = 'SET_NICKNAME';

export function logIn() {
  return dispatch => {
    window.web3.eth.getAccounts((err, accounts) => {
      const acc = accounts[0];
      if(!acc) {
        return;
      }
      const message = window.web3.toHex('MembranaLogin');
      window.web3.personal.sign(message, acc, (err, result) => {
        console.log(result);
        if(!err) {
          apiPost('/auth', null, {sgn: result, addr: acc})
            .then(json => {
              if(!json.name) {
                dispatch(nameRequiredAction());
              } else {
                dispatch(loggedIn(json));
              }
            })
            .catch(err => alert(err.apiErrorCode));
        }
      });
    });
  };
}

export function addName(name) {
  return dispatch => {
    apiPost('/auth/addName', null, {name})
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

export function setNicknameAction(name) {
  return {
    type: SET_NICKNAME,
    name
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



