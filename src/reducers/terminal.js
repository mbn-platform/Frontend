import { SELECT_API_KEY, CANCEL_ORDER, SELECT_MARKET, PLACE_ORDER } from '../actions/terminal';
import { ADD_API_KEY } from '../actions/apiKeys';
import { generateId } from '../demoData/util';

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
    case PLACE_ORDER: {
      const order = action.order;
      order._id = generateId();
      const open = state.orders.open;
      return {...state, orders: {completed: state.orders.completed, open: [order].concat(open)}}; 
    }
    case ADD_API_KEY:
      if(!state.selectedApiKey) {
        return {...state, selectedApiKey: action.apiKey};
      } else {
        return state;
      }
    default:
      return state;
  }
}
