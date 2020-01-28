import { ApiAssetGroup } from '../generic/api';
import defaultErrorHandler from '../generic/errorHandlers';
import { showInfoModal } from './modal';

const AssetGroupApi = new ApiAssetGroup();

export const GET_ASSET_GROUP = 'GET_ASSET_GROUP';
export const SET_ASSET_GROUP = 'SET_ASSET_GROUP';
export const UPDATE_ASSET_GROUP = 'UPDATE_ASSET_GROUP';
export const DELETE_ASSET_GROUP = 'DELETE_ASSET_GROUP';
export const UPDATE_GROUP_BALANCE = 'UPDATE_GROUP_BALANCE';

export const getAssetGroups = () => {
  return dispatch => {
    AssetGroupApi.fetch()
      .then((assetGroups) => {
        dispatch({
          type: GET_ASSET_GROUP,
          assetGroups,
        });
      })
      .catch(err => {
        if (err.reason) {
          dispatch(showInfoModal(`dashboard.errors.${err.reason}`));
        }
      });
  };
};

export const createAssetGroup = (name, exchange, contracts = []) => {
  return dispatch => {
    AssetGroupApi.create(name, exchange, contracts)
      .then(assetGroup => {
        dispatch({
          type: SET_ASSET_GROUP,
          assetGroup,
        });
      })
      .catch(err => {
        if (err.reason) {
          dispatch(showInfoModal(`dashboard.errors.${err.reason}`));
        }
      });
  };
};

export const updateAssetGroup = (id, contracts) => {
  return dispatch => {
    AssetGroupApi.update(id, contracts)
      .then(assetGroup => {
        dispatch({
          type: UPDATE_ASSET_GROUP,
          assetGroup,
        });
      })
      .catch(err => {
        if (err.reason) {
          dispatch(showInfoModal(`dashboard.errors.${err.reason}`));
        }
      });
  };
};

export const deleteAssetGroup = (id, name) => {
  return dispatch => {
    AssetGroupApi.delete(id)
      .then(() => dispatch({
        type: DELETE_ASSET_GROUP,
        id,
        name,
      }))
      .catch(err => {
        defaultErrorHandler(err, dispatch);
      });
  };
};
