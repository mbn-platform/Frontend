import { reducerCreator } from 'generic/util';
import { GET_TIME } from 'actions/time';

const reducerList = {
  [GET_TIME]: (_, { time }) => time,
};

export default reducerCreator(Date.now(), reducerList);
