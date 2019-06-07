import { GET_TR_BLOCK , SET_TR_PAGE_SIZE, SET_TR_PAGE } from '../actions/profile';
import { listReducer } from './util';

export default listReducer({
  get: GET_TR_BLOCK,
  setPageSize: SET_TR_PAGE_SIZE,
  setPage: SET_TR_PAGE,
}, null, {
  pageSize: 10,
});
