export const DELETE_API_KEY = 'DELETE_API_KEY';
export const ADD_API_KEY = 'ADD_API_KEY';


export function deleteApiKey(key) {
  return {
    type: DELETE_API_KEY,
    apiKey: key
  }
}

export function addApiKey(key) {
  return {
    type: ADD_API_KEY,
    apiKey: key
  }
}
