import {Hashlog} from '../generic/api';
import { setBlockForActionList } from './actionsList';

const HashlogApi = new Hashlog();

export const GET_HASHLOG_BLOCKS = 'GET_HASHLOG_BLOCKS';
export const SET_HASHLOG_PAGE = 'SET_HASHLOG_PAGE';
export const SET_HASHLOG_PAGE_SIZE = 'SET_HASHLOG_PAGE_SIZE';

export const getBlockListPage = (page, size) => {
  return dispatch => {
    HashlogApi.fetchBlocksPage(page, size)
      .then(({items, count}) => {
        dispatch({
          type: GET_HASHLOG_BLOCKS,
          blockList: items,
          totalBlocks: count,
        });
      });
  };
};

export const getBlock = blockNumber => {
  return dispatch => {
    HashlogApi.fetchBlock(blockNumber)
      .then(blockInfo => {
        dispatch(setBlockForActionList(blockInfo));
      });
  };
};

export const setBlockListPage = page => {
  return dispatch => {
    dispatch({
      type: SET_HASHLOG_PAGE,
      blocksPage: page,
    });
  };
};

export const setBlockListPageSize = pageSize => {
  return dispatch => {
    dispatch({
      type: SET_HASHLOG_PAGE_SIZE,
      blocksPageSize: pageSize,
    });
  };
};
