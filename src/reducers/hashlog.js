import { GET_HASHLOG_BLOCKS, SET_HASHLOG_PAGE, SET_HASHLOG_PAGE_SIZE } from '../actions/hashlog';

export default (state = {
  blocksPage: 1,
  blocksPageSize: 25,
  totalBlocks: 20,
  currentBlock: null,
  currentActionsList: []
}, action) => {
  switch(action.type) {
    case GET_HASHLOG_BLOCKS:
      return {
        ...state,
        blockList: action.blockList,
        totalBlocks: action.totalBlocks,
      };
    case SET_HASHLOG_PAGE:
      return {
        ...state,
        blocksPage: action.blocksPage,
      };
    case SET_HASHLOG_PAGE_SIZE:
      return {
        ...state,
        blocksPageSize: action.blocksPageSize,
      };

    default:
      return state;
  }
};
