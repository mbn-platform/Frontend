import { UPDATE_TARIFFS, UPDATE_TARIFF_BY_ID } from '../actions/tariffs';

export default (state = {}, action) => {
  switch (action.type) {
    case UPDATE_TARIFFS:
      return action.tariffs;
    case UPDATE_TARIFF_BY_ID:
      const newState = state.map(item => {
        if (item._id === action.tariff._id) {
          return action.tariff;
        }
        return item;
      });

      return newState;
    default:
      return state;
  }
}
