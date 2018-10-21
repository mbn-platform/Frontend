import {
  SET_ACTION_LIST,
  GET_ACTION_LIST,
  SET_ACTION_LIST_PAGE,
  SET_ACTION_LIST_PAGE_SIZE
} from '../actions/actionsList';

export default (state = {
  blockInfo: {
    actions: [],
  },
  actionsList: [],
  actionsListCount: 0,
  actionListPage: 1,
  actionListPageSize: 25,
}, action) => {
  switch(action.type) {
    case SET_ACTION_LIST:
      return {
        ...state,
        blockInfo: action.blockInfo,
      };

    case GET_ACTION_LIST:
      return {
        ...state,
        actionsList: action.actionsList,
        actionsListCount: action.actionsListCount
      };

    case SET_ACTION_LIST_PAGE:
      return {
        ...state,
        actionListPage: action.blocksPage,
      };
    case SET_ACTION_LIST_PAGE_SIZE:
      return {
        ...state,
        actionListPageSize: action.blocksPageSize,
      };

    default:
      return state;
  }
};
