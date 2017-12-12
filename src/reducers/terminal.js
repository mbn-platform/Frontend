import { SELECT_API_KEY } from '../actions/terminal';

export default function(state = {selectedApiKey: null}, action) {
  switch(action.type) {
    case SELECT_API_KEY: {
      return {...state, selectedApiKey: action.key};
      break;
    }
    default:
      return state;
  }
}
