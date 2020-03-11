import { reducerCreator } from 'generic/util';
import { UPDATE_TARIFFS, UPDATE_TARIFF_BY_ID } from 'actions/tariffs';

const reducerList = {
  [UPDATE_TARIFFS]: (_, { tariffs }) => tariffs,
  [UPDATE_TARIFF_BY_ID]: (state, { tariff }) => (
    state.map(item => item._id === tariff._id ? tariff : item)
  ),
};

export default reducerCreator({}, reducerList);
