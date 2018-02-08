
const API_URL = '/bittrexApi/api/v1.1/public';
export function getTicker(market) {
  const url = '/getticker';
  const params = `market=${market}`;
  return apiCall(url, params);
}

export function getMarkets() {
  return apiCall('/getmarkets');
}

export function getCurrencies() {
  return apiCall('/getcurrencies');
}

export function getMarketSummaries() {
  return apiCall('/getmarketsummaries');
}

export function getMarketSummary(market) {
  return apiCall('/getmarketsummary', `market=${market}`);
}

export function getOrderBook(market, type) {
  return apiCall('/getorderbook', `market=${market}&type=${type}`);
}

export function getMarketHistory(market) {
  return apiCall('/getmarkethistory', `market=${market}`);
}

function getSelectedNet() {
  return window.localStorage.getItem('selectedNet') || 'mainnet';
}

function apiCall(url, params) {
  const fullUrl = API_URL + url + '?' + (params || '');
  return window.fetch(fullUrl, {headers: {'X-Network': getSelectedNet()}})
    .then(res => res.json());
}
