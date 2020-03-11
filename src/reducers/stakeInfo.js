import { reducerCreator } from 'generic/util';
import { GET_STAKE_INFO, STAKE_RATING } from 'actions/profile';

const initialState = {
  rating: [],
  info: {},
};

const reducerList = {
  [GET_STAKE_INFO]: (state, { info }) => ({ ...state, info }),
  [STAKE_RATING]: (state, { rating }) => ({ ...state, rating }),
};

export default reducerCreator(initialState, reducerList);

