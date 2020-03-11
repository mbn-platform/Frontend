import { reducerCreator } from 'generic/util';
import {
  SET_ACTION_LIST,
  GET_ACTION_LIST,
  SET_ACTION_LIST_PAGE,
  SET_ACTION_LIST_PAGE_SIZE
} from 'actions/actionsList';

const initialState = {
  blockInfo: {
    actions: [],
  },
  actionsList: [],
  actionsListCount: 0,
  actionListPage: 1,
  actionListPageSize: 25,
};

const reducerList = {
  [SET_ACTION_LIST]: (state, { blockInfo }) => ({ ...state, blockInfo }),
  [GET_ACTION_LIST]: (state, { actionsList, actionsListCount }) => ({
    ...state, actionsList, actionsListCount,
  }),
  [SET_ACTION_LIST_PAGE]: (state, { actionListPage }) => ({
    ...state, actionListPage,
  }),
  [SET_ACTION_LIST_PAGE_SIZE]: (state, { actionListPageSize }) => ({
    ...state, actionListPageSize,
  }),
};


export default reducerCreator(initialState, reducerList);
