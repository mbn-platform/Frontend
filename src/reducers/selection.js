import { reducerCreator } from 'generic/util';
import { UPDATE_SELECTION } from 'actions/selection';

const reducerList = {
  [UPDATE_SELECTION]: (state, { selection }) => selection,
};

export default reducerCreator(null, reducerList);
