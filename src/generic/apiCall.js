export class ApiError extends Error {
  constructor(code) {
    super();
    this.apiErrorCode = code;
  }
}


const defaultPostParams = {
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'same-origin',
  method: 'POST',
};

const defaultGetParams = {
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'same-origin',
  method: 'GET',
};



ApiError.NAME_ALREADY_SET = -41;
ApiError.FORBIDDEN = -103;
ApiError.NOT_FOUND = -104;
//key balance lower than min amount
ApiError.WRONG_MIN_AMOUNT = -73;
ApiError.WRONG_DEAL_TERMS = -74;
ApiError.DUPLICATE_KEY = -76;
ApiError.ORDER_NOT_OPEN = -501;
ApiError.WRONG_API_KEY = -504;
ApiError.EXCHANGE_ERROR = -599;
ApiError.MIN_TRADE_REQUIREMENT_NOT_MET = -502;
ApiError.INSUFFICIENT_FUNDS = -503;
ApiError.UNIQUE_VIOLATION = -40;
ApiError.INVALID_PARAMS_SET = -5;
ApiError.KEY_IN_USE = -78;

function getSelectedNet() {
  return window.localStorage.getItem('selectedNet') || 'mainnet';
}

const API_PREFIX = '/api/v2';

function jsonRequest(url, params) {
  params.headers['X-Network'] = getSelectedNet();
  return window.fetch(API_PREFIX + url, params).then(res => res.json())
    .then(json => {
      const error = json.error;
      if(error) {
        throw new ApiError(error);
      } else {
        return json;
      }
    });
}


export function apiPost(url, params, data) {
  params = {...defaultPostParams, ...params, body: JSON.stringify(data)};
  return jsonRequest(url, params);
}

export function apiPut(url, params, data) {
  return apiPost(url, {...params, method: 'PUT'}, data);
}

export function apiDelete(url, params) {
  params = {...defaultDeleteParams, ...params};
  return jsonRequest(url, params);
}

const defaultDeleteParams = {
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'same-origin',
  method: 'DELETE',
};


export function apiGet(url, params) {
  params = {...defaultGetParams, ...params};
  return jsonRequest(url, params);
}

