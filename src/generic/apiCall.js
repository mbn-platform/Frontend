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
ApiError.ORDER_NOT_OPEN = -501;
ApiError.EXCHANGE_ERROR = -599;
ApiError.MIN_TRADE_REQUIREMENT_NOT_MET = -502;
ApiError.INSUFFICIENT_FUNDS = -503;

function jsonRequest(request) {
  return request.then(res => res.json())
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
  return jsonRequest(window.fetch(url, params));
}

export function apiPut(url, params, data) {
  return apiPost(url, {...params, method: 'PUT'}, data);
}

export function apiDelete(url, params) {
  params = {...defaultDeleteParams, ...params};
  return jsonRequest(window.fetch(url, params));
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
  return jsonRequest(window.fetch(url, params));
}

