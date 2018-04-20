import { apiGet, ApiError } from '../generic/apiCall';
import defaultErrorHandler from '../generic/errorHandlers';
export const UPDATE_DASHBOARD = 'UPDATE_DASHBOARD';
export const UPDATE_KEYS = 'UPDATE_KEYS';

export function fetchDashboardData() {
  return dispatch => {
    apiGet('/api/dashboard')
      .then(json => dispatch({
        type: UPDATE_DASHBOARD,
        data: json
      }))
      .catch(err => {
        defaultErrorHandler(err, dispatch);
      });
  };
}