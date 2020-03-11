import { reducerCreator } from 'generic/util';
import {
  GET_ASSET_GROUP,
  SET_ASSET_GROUP,
  UPDATE_ASSET_GROUP,
  DELETE_ASSET_GROUP,
  UPDATE_GROUP_BALANCE,
} from 'actions/assetGroup';

const reducerList = {
  [GET_ASSET_GROUP]: (_, { assetGroups }) => assetGroups,
  [SET_ASSET_GROUP]: (state, { assetGroup }) => [...state, assetGroup],
  [UPDATE_GROUP_BALANCE]: (state, { _id, balances }) => {
    return state.map((item) => item._id === _id ? { ...item, balances } : item);
  },
  [UPDATE_ASSET_GROUP]: (state, { assetGroup }) => {
    return state.map(item => item._id === assetGroup._id ? assetGroup : item);
  },
  [DELETE_ASSET_GROUP]: (state, { id }) => {
    return state.filter(item => item._id !== id);
  },
};

export default reducerCreator([], reducerList);
