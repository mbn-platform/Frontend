import {
  GET_ASSET_GROUP,
  SET_ASSET_GROUP,
  UPDATE_ASSET_GROUP,
  DELETE_ASSET_GROUP,
  UPDATE_GROUP_BALANCE,
} from '../actions/assetGroup';

export default (state = [], action) => {
  switch(action.type) {
    case GET_ASSET_GROUP:
      return action.assetGroups;

    case SET_ASSET_GROUP:
      return [...state, action.assetGroup];

    case UPDATE_GROUP_BALANCE: {
      state = state.map((item) => item._id === action._id ? {...item, balances: action.balances} : item);
      return state;
    }

    case UPDATE_ASSET_GROUP:
      const { assetGroup } = action;

      return state.map(item => item._id === assetGroup._id ? assetGroup : item);

    case DELETE_ASSET_GROUP:
      return state.filter(item => item._id !== action.id);

    default:
      return state;
  }
};
