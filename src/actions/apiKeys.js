import { makeId } from '../generic/util';
export const DELETE_API_KEY = 'DELETE_API_KEY';
export const ADD_API_KEY = 'ADD_API_KEY';
export const UPDATE_API_KEY = 'UPDATE_API_KEY';

export function deleteApiKey(key) {
  return {
    type: DELETE_API_KEY,
    apiKey: key
  };
}


export function addApiKey(key) {
  const resultKey = {...key};
  delete resultKey.secret;
  resultKey._id = makeId();
  resultKey.state = 'FREE';
  resultKey.currencies = resultKey.currencies.map(c => {
    const amount = Math.floor(Math.random() * 100);
    return {name: c, amount, enabled: true};
  });
  return {
    type: ADD_API_KEY,
    apiKey: resultKey
  };
}

export function updateApiKey(key, original) {
  return {
    type: UPDATE_API_KEY,
    apiKey: key,
  };
}
