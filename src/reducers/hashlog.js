import { reducerCreator } from 'generic/util';
import {
  GET_HASHLOG_BLOCKS, SET_HASHLOG_PAGE, SET_HASHLOG_PAGE_SIZE,
} from 'actions/hashlog';

const initialState = {
  blocksPage: 1,
  blocksPageSize: 25,
  totalBlocks: 20,
  currentBlock: null,
  currentActionsList: [],
};

const reducerList = {
  [GET_HASHLOG_BLOCKS]: (state, { blockList, totalBlocks }) => ({
    ...state, blockList, totalBlocks,
  }),
  [SET_HASHLOG_PAGE]: (state, { blocksPage }) => ({
    ...state, blocksPage,
  }),
  [SET_HASHLOG_PAGE_SIZE]: (state, { blocksPageSize }) => ({
    ...state, blocksPageSize,
  }),
};

export default reducerCreator(initialState, reducerList);
