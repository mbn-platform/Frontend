import { UPDATE_SELECTION } from '../actions/selection';

export default (state = null, action) => {
  switch (action.type) {
    case UPDATE_SELECTION:
      return action.selection;
    default:
      return state;
  }
};
