import { reducerCreator } from 'generic/util';
import { UPDATE_RATINGS } from 'actions/terminal';

const reducerList = {
  [UPDATE_RATINGS]: (_, { rating }) => rating,
};

export default reducerCreator([], reducerList);
