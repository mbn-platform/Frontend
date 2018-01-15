import { apiGet } from '../generic/apiCall';
export const UPDATE_DASHBOARD = 'UPDATE_DASHBOARD';

export function fetchDashboardData() {
  return dispatch => {
    apiGet('/api/dashboard')
      .then(json => dispatch({
        type: UPDATE_DASHBOARD,
        data: json
      }))
      .catch(err => console.log('catched eror', err));
  };
}
