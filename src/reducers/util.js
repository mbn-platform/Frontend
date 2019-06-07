export const defaultListState = {
  list: [],
  page: 1,
  pageSize: 25,
  count: 0,
};
export function listReducer(actions, fallback, defaultState) {
  return (state = {
    ...defaultListState,
    ...defaultState,
  }, action) => {
    switch (action.type) {
      case actions.get: {
        return {
          ...state,
          list: action.list,
          count: action.count,
        };
      }
      case actions.setPageSize: {
        return {
          ...state,
          pageSize: action.pageSize,
        };
      }
      case actions.setPage: {
        return {
          ...state,
          page: action.page,
        };
      }
      default:
        if (fallback) {
          return fallback(state, action);
        } else {
          return state;
        }
    }
  };
}
