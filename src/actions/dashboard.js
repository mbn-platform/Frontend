export const UPDATE_DASHBOARD = 'UPDATE_DASHBOARD';

export function fetchDashboardData() {
  return dispatch => {
    window.fetch('/api/dashboard', {
      credentials: 'same-origin'
    }).then(res => res.json()).then(data => {
      dispatch({
        type: 'UPDATE_DASHBOARD',
        data: data
      });
    });
  };
}
