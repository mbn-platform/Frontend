import { apiPut } from '../generic/apiCall';
import { LOGGED_OUT } from '../actions/auth';
export const DELETE_API_KEY = 'DELETE_API_KEY';
export const ADD_API_KEY = 'ADD_API_KEY';
export const UPDATE_API_KEY = 'UPDATE_API_KEY';


export function deleteApiKey(key) {
  return dispatch => {
    apiDelete('/api/key/' + key._id)
      .then(() => dispatch({
        type: DELETE_API_KEY,
        apiKey: key,
      }))
      .catch(error => {
        if(error.apiErrorCode) {
          switch(error.apiErrorCode) {
            case ApiError.FORBIDDEN: {
              dispatch({
                type: LOGGED_OUT,
              });
              break;
            }
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
  return dispatch => {
    apiPost('/api/key', null, key)
      .then(json => dispatch({
        type: ADD_API_KEY,
        apiKey: json,
      }))
      .catch(error => {
        if(error.apiErrorCode) {
          switch(error.apiErrorCode) {
            default:
              console.log('unhandled api error', error.apiErrorCode);
          }
        }
      });
  };
}

class ApiError extends Error {
  constructor(code) {
    super();
    this.apiErrorCode = code;
  }
}

const defaultPostParams = {
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'same-origin',
  method: 'post',
};



ApiError.FORBIDDEN = -103;

function jsonRequest(request) {
  return request.then(res => res.json())
    .then(json => {
      const error = json.error;
      if(error) {
        throw new ApiError(error);
      } else {
        return json;
      }
    });
}


export function apiPost(url, params, data) {
  params = {...defaultPostParams, ...params, body: JSON.stringify(data)};
  return jsonRequest(window.fetch(url, params));
}

export function apiDelete(url, params) {
  params = {...defaultDeleteParams, ...params};
  return jsonRequest(window.fetch(url, params));
}

const defaultDeleteParams = {
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'same-origin',
  method: 'delete',
};

const defaultGetParams = {
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'same-origin',
  method: 'get',
};

export function apiGet(url, params) {
  params = {...defaultGetParams, ...params};
  return jsonRequest(window.fetch(url, params));
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
