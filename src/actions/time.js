import {ApiTime} from '../generic/api';
export const GET_TIME = 'GET_TIME';


const TimeApi = new ApiTime();

export function fetchTime() {
  return dispatch => {
    TimeApi.fetch()
      .then(json => dispatch({
        type: GET_TIME,
        time: json.time
      }))
      .catch(err => console.error('catched eror', err));
  };
}
