import { apiPut, apiGet, ApiError } from '../generic/apiCall';
export const UPDATE_PROFILE = 'UPDATE_PROFILE';
export const GET_PROFILE = 'GET_PROFILE';
export const TRADES_FOR_USER = 'TRADES_FOR_USER';

export function updateProfile(profile) {
  return dispatch => {
    const name = profile.name;
    delete profile.name;
    apiPut(`/profile/${name}/contractSettings`, null, profile)
      .then(json => dispatch({
        type: UPDATE_PROFILE,
        profile: json,
      }));
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
        dispatch(getTradesForUser(name));
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
  }
}
