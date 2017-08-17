export const UPDATE_DASHBOARD = 'UPDATE_DASHBOARD';

export function fetchDashboardData() {
  return dispatch => {
    window.fetch('/api/dashboard').then(res => res.json()).then(data => {
      dispatch({
        type: 'UPDATE_DASHBOARD',
        data: data
      });
    });
  };
  //return async dispatch => {
    //const res = await window.fetch('/api/dashboard');
    //const json = await res.json();
    //dispatch({
      //type: 'UPDATE_DASHBOARD',
      //data: json
    //});
  //}
}
