export const CLEAR_REQUEST = 'CLEAR_REQUEST';

export function clearRequest(name) {
  return dispatch => ({
    type: CLEAR_REQUEST,
    name
  });
}
