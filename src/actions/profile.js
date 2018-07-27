import { apiPut, apiGet, ApiError } from '../generic/apiCall';
import defaultErrorHandler, {profileErrorHandler} from '../generic/errorHandlers';
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
        profileErrorHandler(err, dispatch);
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
        profileErrorHandler(err, dispatch);
      });
  };
}

export function getProfile(name) {
  return dispatch => {
    return apiGet(`/profile/${name}`)
      .then(json => {
        dispatch({
          type: GET_PROFILE,
          profile: json.profile,
        });
        //dispatch(getTradesForUser(name));
      })
      .catch(err => {
        profileErrorHandler(err, dispatch);
      });
  };
}

export function getProfilePageInfo(name) {
  return async dispatch => {
    try {
      const json = await apiGet(`/profile/${name}`);
      dispatch({
        type: GET_PROFILE,
        profile: json.profile,
      });
      dispatch(getFeedbacks(name));
      dispatch(getTradesForUser(name));
    } catch(err) {
      profileErrorHandler(err, dispatch);
    }
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
      })
      .catch(err => {
        profileErrorHandler(err, dispatch);
      });
  };
}

export function getTradesForUser(name) {
  return dispatch => {
    apiGet(`/profile/${name}/history`)
      .then(trades => {
        dispatch({
          type: TRADES_FOR_USER,
          name,
          trades: trades.orders,
        });
      })
      .catch(err => {
        profileErrorHandler(err, dispatch);
      });
  };
}
