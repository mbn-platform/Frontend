import {
  GET_ORDER_INFO,
  GET_ORDER_LIST,
} from '../actions/orderList';

export default (state = {
  ordersList: [],
  orderInfo: {
    type: '-',
    exchange: '-',
    symbol: '-',
    price: '-',
    amount: '-',
    filled: '-',
  }
}, action) => {
  switch(action.type) {
    case GET_ORDER_INFO:
      return {
        ...state,
        orderInfo: action.orderInfo,
      };

    case GET_ORDER_LIST:
      return {
        ...state,
        ordersList: action.ordersList,
      };

    default:
      return state;
  }
};
