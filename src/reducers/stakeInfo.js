import {GET_STAKE_INFO, STAKE_RATING} from '../actions/profile';

export default function(state = {rating: [], info: {}}, action) {
  switch (action.type) {
    case GET_STAKE_INFO:
      return {...state, info: action.info};
    case STAKE_RATING: {
      return {...state, rating: action.rating};
    }
    default:
      return state;
  }
}
