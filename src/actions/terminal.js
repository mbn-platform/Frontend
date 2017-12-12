export const SELECT_API_KEY = 'SELECT_API_KEY';

export function selectApiKey(key) {
  return {
    type: SELECT_API_KEY,
    key
  };
}
