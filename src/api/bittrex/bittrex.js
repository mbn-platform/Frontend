
const API_URL = 'https://api-bittrex.mercatus.im/api/v1.1/public';
export function getTicker(market) {
  const url = '/getticker';
  const params = `market=${market}`;
  return apiCall(url, params);
}

function apiCall(url, params) {
  const fullUrl = API_URL + url + '?' + (params || '');
  return fetch(fullUrl)
    .then(res => res.json())
}
