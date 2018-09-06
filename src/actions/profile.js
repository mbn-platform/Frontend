import { profileErrorHandler } from '../generic/errorHandlers';
import { ApiProfile} from '../generic/api';
export const UPDATE_PROFILE = 'UPDATE_PROFILE';
export const UPDATE_PROFILE_AVAILABLE = 'UPDATE_PROFILE_AVAILABLE';
export const GET_PROFILE = 'GET_PROFILE';
export const TRADES_FOR_USER = 'TRADES_FOR_USER';
export const GET_FEEDBACKS = 'GET_FEEDBACKS';


const ProfileApi = new ApiProfile();

export function updateContractSettings(name, settings) {
  return dispatch => {
    ProfileApi.updateContractSettings(name, settings)
      .then(json => dispatch({
        type: UPDATE_PROFILE_AVAILABLE,
        profile: json,
      }))
      .catch(err => {
        profileErrorHandler(err, dispatch);
      });
  };
}

export function toggleAvailable(name, available) {
  return dispatch => {
    ProfileApi.toggleAvailable(name, available)
      .then(json => dispatch({
        type: UPDATE_PROFILE_AVAILABLE,
        profile: json,
      }))
      .catch(err => {
        profileErrorHandler(err, dispatch);
      });
  };
}

export function updateProfile(profile) {
  return dispatch =>
    dispatch({
      type: UPDATE_PROFILE,
      profile,
    });
}

export function getProfilePageInfo(name) {
  return async dispatch => {
    try {
      const json = await ProfileApi.getProfilePageInfo(name);
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
    ProfileApi.getFeedbacks(name)
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
    ProfileApi.getTradesForUser(name)
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
