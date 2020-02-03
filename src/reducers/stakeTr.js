import { reducerCreator } from 'generic/util';
import { GET_TR_BLOCK , SET_TR_PAGE_SIZE, SET_TR_PAGE } from 'actions/profile';

export const initialState = {
  list: [],
  page: 1,
  pageSize: 10,
  count: 0,
};

const reducerList = {
  [GET_TR_BLOCK]: (state, { list, count }) => ({ ...state, list, count }),
  [SET_TR_PAGE_SIZE]: (state, { pageSize }) => ({ ...state, pageSize }),
  [SET_TR_PAGE]: (state, { page }) => ({ ...state, page }),
};

export default reducerCreator(initialState, reducerList);

