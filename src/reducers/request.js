import { reducerCreator } from 'generic/util';
import { SEND_OFFER } from 'actions/offers';
import { CLEAR_REQUEST } from 'actions/request';

const reducerList = {
  [SEND_OFFER]: (state) => ({ ...state, sendOffer: 'success' }),
  [CLEAR_REQUEST]: (state, { name }) => {
    const newState = {...state};
    delete newState[name];
    return newState;
  },
};

export default reducerCreator({}, reducerList);
