import {GET_STAKE_INFO} from '../actions/profile';

export default function(state = {}, action) {
  switch (action.type) {
    case GET_STAKE_INFO:
      return action.info;
    default:
      return state;
  }
}
