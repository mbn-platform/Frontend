import { apiPut, apiGet, ApiError } from '../generic/apiCall';
import defaultErrorHandler from '../generic/defaultErrorHandler';
export const UPDATE_PROFILE = 'UPDATE_PROFILE';
export const GET_PROFILE = 'GET_PROFILE';
export const TRADES_FOR_USER = 'TRADES_FOR_USER';
export const GET_FEEDBACKS = 'GET_FEEDBACKS';

export function updateContractSettings(name, settings) {
  return dispatch => {
    apiPut(`/profile/${name}/contractSettings`, null, settings)
      .then(json => dispatch({
        type: UPDATE_PROFILE,
        profile: json,
      }))
      .catch(err => {
        defaultErrorHandler(err, dispatch);
      });
  };
}

export function toggleAvailable(name, available) {
  return dispatch => {
    apiPut(`/profile/${name}/available`, null, available)
      .then(json => dispatch({
        type: UPDATE_PROFILE,
        profile: json,
      }))
      .catch(err => {
        defaultErrorHandler(err, dispatch);
      });
  };
}

export function getProfile(name) {
  return dispatch => {
    apiGet(`/profile/${name}`)
      .then(json => {
        dispatch({
          type: GET_PROFILE,
          profile: json.profile,
        });
        //dispatch(getTradesForUser(name));
      })
      .catch(e => {
        if(e.apiErrorCode) {
          switch(e.apiErrorCode) {
            case ApiError.NOT_FOUND:
              alert('no such profile');
              break;
            default:
              console.log('unhandled api error', e.apiErrorCode);
          }
        } else {
          console.log(e);
        }
      });
  };
}

export function getFeedbacks(name) {
  return dispatch => {
    apiGet(`/profile/${name}/feedbacks`)
      .then(json => {
        dispatch({
          type: GET_FEEDBACKS,
          feedbacks: json.feedbacks,
        });
      });
  };
}

export function getTradesForUser(name) {
  return dispatch => {
    apiGet(`/tradesForUser/${name}`)
      .then(trades => {
        dispatch({
          type: TRADES_FOR_USER,
          name,
          trades,
        });
      });
  };
}
