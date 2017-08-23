import { LOGGED_OUT } from '../actions/auth';
const errors = {
  FORBIDDEN: -103
};

export function apiGet(url, params, dispatch) {
  params = {credentials: 'same-origin', ...params};
  return window.fetch(url, params)
    .then(res => handleRequest(dispatch, res));
}

export function apiDelete(url, dispatch) {
  return window.fetch(url, {
    method: 'delete',
    credentials: 'same-origin'
  }).then(res => handleRequest(dispatch, res));
}

export function apiPost(url, params, dispatch) {
  params = {
    method: 'post',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    }, ...params
  };
  return window.fetch(url, params).then(res => handleRequest(dispatch, res));
}

export function apiPut(url, params, dispatch) {
  params = {
    method: 'put',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    }, ...params
  };
  return window.fetch(url, params).then(res => handleRequest(dispatch, res));
}

function handleRequest(dispatch, response) {
  return response.json()
    .then(json => {
      if(json.error) {
        handleError(dispatch, json.error);
      }
      return json;
    });
}

const handleError = (dispatch, error) => {
  switch(error) {
    case errors.FORBIDDEN:
      dispatch({type: LOGGED_OUT});
      break;
    default:
      console.log('unhandled error', error);
  }
  throw error;
};
