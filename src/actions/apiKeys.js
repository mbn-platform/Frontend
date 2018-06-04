import { apiPut, apiDelete, apiGet, apiPost, ApiError } from '../generic/apiCall';
import defaultErrorHandler from '../generic/errorHandlers';
import { LOGGED_OUT } from '../actions/auth';
import {UPDATE_KEYS} from './dashboard';
import {SELECT_FUND} from './terminal';
export const DELETE_API_KEY = 'DELETE_API_KEY';
export const ADD_API_KEY = 'ADD_API_KEY';
export const UPDATE_API_KEY = 'UPDATE_API_KEY';
export const UPDATE_API_KEY_BALANCE = 'UPDATE_API_KEY_BALANCE';

export function fetchKeys() {
  return dispatch => {
    apiGet('/key')
      .then(json => dispatch({
        type: UPDATE_KEYS,
        data: json.own
      }))
      .catch(err => {
        defaultErrorHandler(err, dispatch);
      });
  };
}

export function deleteApiKey(key) {
  return (dispatch, getState) => {
    apiDelete('/key/' + key._id)
      .then(() => {
        const selectedKey = getState().terminal.fund;
        const storageKey = JSON.parse(localStorage.getItem('terminal.selectedFund'))
        if (storageKey && storageKey._id === key._id) {
          localStorage.removeItem('terminal.selectedFund');
        }
        if (selectedKey._id === key._id) {
          const exchange = getState().terminal.exchange
          const ownKeys = getState().apiKeys.ownKeys.filter(key => key.exchange === exchange)
          let currentKeyIndex = ownKeys.findIndex(k => k._id == selectedKey._id);
          let newSelectedKey = null;
          if (ownKeys.length > 1) {
            newSelectedKey = (currentKeyIndex == (ownKeys.length - 1) ? ownKeys[currentKeyIndex - 1] : ownKeys[currentKeyIndex + 1]);
          }
          dispatch({
            type: SELECT_FUND,
            fund: newSelectedKey
          });
        }
        dispatch({
          type: DELETE_API_KEY,
          apiKey: key,
        });
      })
      .catch(error => {
        if (error.apiErrorCode) {
          switch (error.apiErrorCode) {
            case ApiError.FORBIDDEN: {
              dispatch({
                type: LOGGED_OUT,
              });
              break;
            }
            case ApiError.KEY_IN_USE:
              alert('The key is in use');
              return;
            default:
              console.log('unhandled api error', error.apiErrorCode);
          }
        } else {
          console.log('error deleting key', error);
        }
      });
  };
}


export function addApiKey(key) {
  return (dispatch, getState) => {
    apiPost('/key', null, key)
      .then(json => {
        dispatch({
          type: ADD_API_KEY,
          apiKey: json,
        });
        const ownKeys = getState().apiKeys.ownKeys
        if (ownKeys.length === 1) {
          dispatch({
            type: SELECT_FUND,
            fund: ownKeys[0]
          });
        }
      })
      .catch(error => {
        if(error.apiErrorCode) {
          switch(error.apiErrorCode) {
            case ApiError.INVALID_PARAMS_SET:
              alert('Invalid key/secret pair');
              return;
            case ApiError.UNIQUE_VIOLATION:
              alert('This key already in system');
              return;
            default:
              console.log('unhandled api error', error.apiErrorCode);
          }
        }
      });
  };
}

export function updateApiKey(key) {
  return dispatch => {
    apiPut('/api/key/' + key._id, null, {currencies: key.currencies})
      .then(apiKey => {
        dispatch({
          type: UPDATE_API_KEY,
          apiKey,
        });
      })
      .catch(err => {
        console.log(err);
        console.log(err.apiErrorCode);
      });
  };
}

export function updateKeyBalance(_id, balances) {
  return {
    type: UPDATE_API_KEY_BALANCE,
    _id,
    balances,
  };
}
