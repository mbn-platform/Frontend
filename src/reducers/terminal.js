import { SELECT_API_KEY, CANCEL_ORDER, SELECT_MARKET } from '../actions/terminal';

export default function(state = {
  selectedApiKey: null,
  selectedMarket: 'USDT-BTC',
  orders: {open: [], completed: []},
}, action) {
  switch(action.type) {
    case SELECT_API_KEY: {
      return {...state, selectedApiKey: action.key};
    }
    case CANCEL_ORDER: {
      const id = action.order._id;
      const openOrders = state.orders.open.filter(o => o._id !== id);
      return {...state, orders: {open: openOrders, completed: state.orders.completed}};
    }
    case SELECT_MARKET:
      return {...state, selectedMarket: action.market};
    default:
      return state;
  }
}
