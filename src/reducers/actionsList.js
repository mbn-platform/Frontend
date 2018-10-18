import { SET_ACTION_LIST, GET_ACTION_LIST } from '../actions/actionsList';

export default (state = {
  currentBlock: null,
  currentActionsList: []
}, action) => {
  switch(action.type) {
    case SET_ACTION_LIST:
      return {
        ...state,
        currentBlock: action.currentBlock,
      };

    case GET_ACTION_LIST:
      return {
        ...state,
        currentBlock: action.currentBlock,
      };
    default:
      return state;
  }
};
