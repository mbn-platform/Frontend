import {ActionList} from '../generic/api';

const ActionListApi = new ActionList();

export const GET_ACTION_LIST = 'GET_ACTION_LIST';
export const SET_ACTION_LIST = 'SET_ACTION_LIST';
export const SET_ACTION_LIST_PAGE = 'SET_ACTION_LIST_PAGE';
export const SET_ACTION_LIST_PAGE_SIZE = 'SET_ACTION_LIST_PAGE_SIZE';

export const getActionListPage = (blockNumber, page, size) => {
  return dispatch => {
    ActionListApi.getActionList(blockNumber, page, size)
      .then(({count, items}) => {
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
    blockInfo: blockInfo,
  });
};

export const setActionListPage = page => {
  return dispatch =>
    dispatch({
      type: SET_ACTION_LIST_PAGE,
      actionListPage: page,
    });
};

export const setActionListPageSize = pageSize => {
  return dispatch =>
    dispatch({
      type: SET_ACTION_LIST_PAGE_SIZE,
      actionListPageSize: pageSize,
    });
};

