import { reducerCreator } from 'generic/util';
import { UPDATE_EXCHANGE_RATES } from 'actions/terminal';

const reducerList = {
  [UPDATE_EXCHANGE_RATES]: (_, { rates }) => rates,
};

export default reducerCreator(null, reducerList);
