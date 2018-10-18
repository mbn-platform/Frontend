import {ActionList} from '../generic/api';

const ActionListApi = new ActionList();

export const GET_ACTION_LIST = 'GET_ACTION_LIST';
export const SET_ACTION_LIST = 'SET_ACTION_LIST';

export const getActionListPage = (blockNumber, page, size) => {
  return dispatch => {
    ActionListApi.getActionList(blockNumber, page, size)
      .then(({items, count}) => {
        console.warn(items, count);
        dispatch({
          type: GET_ACTION_LIST,
          actionsList: items,
          actionsListCount: count
        });
      });
  };
};

export const setBlockForActionList = blockInfo => {
  return dispatch => dispatch({
    type: SET_ACTION_LIST,
  });
};

