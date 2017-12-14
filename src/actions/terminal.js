export const SELECT_API_KEY = 'SELECT_API_KEY';
export const CANCEL_ORDER = 'CANCEL_ORDER';

export function selectApiKey(key) {
  return {
    type: SELECT_API_KEY,
    key
  };
}

export function cancelOrder(order) {
  console.log('canceling order');
  return {
    type: CANCEL_ORDER,
    order
  };
}
 
