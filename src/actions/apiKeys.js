export const DELETE_API_KEY = 'DELETE_API_KEY';
export const ADD_API_KEY = 'ADD_API_KEY';
export const UPDATE_API_KEY = 'UPDATE_API_KEY';

export function deleteApiKey(key) {
  return dispatch => {
    window.fetch('/api/keys/' + key.keyId, {method: 'delete'})
      .then(res => res.json())
      .then(json => dispatch({
        type: DELETE_API_KEY,
        apiKey: key
      }));
  };
}

export function addApiKey(key) {
  return dispatch => {
    window.fetch('/api/keys', {
      method: 'post',
      body: JSON.stringify(key)
    }).then(res => res.json())
      .then(json => {
        key.keyId = Math.random().toFixed(10);
        dispatch({
          type: ADD_API_KEY,
          apiKey: key
        })
      });
  };
}

export function updateApiKey(key) {
  return dispatch => {
    window.fetch('/api/keys/' + key.keyId, {
      method: 'put',
      body: JSON.stringify(key)
    }).then(res => res.json())
      .then(json => {
        dispatch({
          type: UPDATE_API_KEY,
          apiKey: key
        })
      });
  };
}
