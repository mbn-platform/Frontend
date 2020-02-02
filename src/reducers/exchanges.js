import { reducerCreator } from 'generic/util';
import { UPDATE_EXCHANGES } from 'actions/exchanges';

const reducerList = {
  [UPDATE_EXCHANGES]: (_, { exchanges }) => exchanges,
};

export default reducerCreator([], reducerList);
