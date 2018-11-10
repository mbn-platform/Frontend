import { OrderList } from '../generic/api';

const OrderListApi = new OrderList();

export const GET_ORDER_INFO = 'GET_ORDER_INFO';
export const GET_ORDER_LIST = 'GET_ORDER_LIST';

export const getOrderListPage = orderId => {
  return dispatch => {
    // OrderListApi.getOrderActionsList(orderId)
    //   .then(ordersList => {
    //     dispatch({
    //       type: GET_ORDER_LIST,
    //       ordersList
    //     });
    //   });
    const ordersList = [
      {
        type: 'order_create',
        params: {},
        timestamp: 872806440,
        createdAt: new Date().toISOString(),
        hash: 'a12312312312312312312',
      },
      {
        type: 'order_update',
        params: {
          fill: 0.012
        },
        timestamp: 872806440,
        createdAt: new Date().toISOString(),
        hash: 'a12312312312312312312',
      },
      {
        type: 'order_cancel',
        params: {
          reason: 'canceled'
        },
        timestamp: 872806440,
        createdAt: new Date().toISOString(),
        hash: 'a12312312312312312312',
      }
    ];
    dispatch({
      type: GET_ORDER_LIST,
      ordersList
    });
  };
};

export const getOrderInfo = orderId => {
  return dispatch => {
    //OrderListApi.getOrderInfo(orderId);
    // .then(orderInfo => {
    //   dispatch({
    //     type: GET_ORDER_INFO,
    //     orderInfo
    //   });
    // });
    //TODO Temporary test data
    const orderInfo = {
      id: '11231231231231211123232131231232312',
      state: 'OPEN',
      symbol: 'BTC-ETH',
      exchange: 'huobi',
      type: 'SELL',
      limit: 0.2,
      price:	0.976512,
      filled: 100.999907,
      amount:	100.999907,
      createdAt:	new Date().toISOString(),
      closedAt:	new Date().toISOString(),
      canceledAt:	new Date().toISOString(),
    };
    dispatch({
      type: GET_ORDER_INFO,
      orderInfo
    });
  };
};


