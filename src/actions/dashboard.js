import defaultErrorHandler from '../generic/errorHandlers';
import {ApiDashboard} from '../generic/api';
export const UPDATE_DASHBOARD = 'UPDATE_DASHBOARD';
export const UPDATE_KEYS = 'UPDATE_KEYS';

const DashboardApi = new ApiDashboard();

export function fetchDashboardData() {
  return dispatch => {
    DashboardApi.fetch()
      .then(json => dispatch({
        type: UPDATE_DASHBOARD,
        data: json
      }))
      .catch(err => {
        defaultErrorHandler(err, dispatch);
      });
  };
}
