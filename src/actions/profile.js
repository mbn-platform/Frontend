import { apiPut, apiGet, ApiError } from '../generic/apiCall';
export const UPDATE_PROFILE = 'UPDATE_PROFILE';
export const GET_PROFILE = 'GET_PROFILE';

export function updateProfile(profile) {
  return dispatch => {
    const name = profile.name;
    delete profile.name;
    window.fetch('/api/profile/' + name, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'put',
      credentials: 'same-origin',
      body: JSON.stringify(profile),
    }).then(res => res.json())
      .then(json => dispatch({
        type: UPDATE_PROFILE,
        profile: json,
      }));
  };
}

export function getProfile(name) {
  return dispatch => {
    apiGet(`/api/profile/${name}`)
      .then(profile => {
        dispatch({
          type: GET_PROFILE,
          profile,
        });
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

