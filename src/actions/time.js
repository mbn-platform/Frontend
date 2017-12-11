import { apiGet } from '../generic/apiCall';
export const GET_TIME = 'GET_TIME';

export function fetchTime() {
  return {
    type: GET_TIME,
    time: Date.now()
  };
}
