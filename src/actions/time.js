import { apiGet } from '../generic/apiCall';
export const GET_TIME = 'GET_TIME';

export function fetchTime() {
  return dispatch => {
    apiGet('/api/time', null, dispatch)
      .then(json => dispatch({
        type: GET_TIME,
        time: json.time
      }))
      .catch(err => console.log('catched eror', err));
  };
}
