import { profileErrorHandler } from '../generic/errorHandlers';
import { ApiProfile} from '../generic/api';
import { ApiError} from '../generic/apiCall';
import { showConfirmModal, showInfoModal } from './modal';
export const UPDATE_PROFILE = 'UPDATE_PROFILE';
export const UPDATE_PROFILE_AVAILABLE = 'UPDATE_PROFILE_AVAILABLE';
export const GET_PROFILE = 'GET_PROFILE';
export const TRADES_FOR_USER = 'TRADES_FOR_USER';
export const GET_FEEDBACKS = 'GET_FEEDBACKS';
export const STATS_FOR_USER = 'STATS_FOR_USER';
export const GET_TR_BLOCK = 'GET_TR_BLOCK';
export const SET_TR_PAGE_SIZE = 'SET_TR_PAGE_SIZE';
export const SET_TR_PAGE = 'SET_TR_PAGE';
export const GET_STAKE_INFO = 'GET_STAKE_INFO';

const ProfileApi = new ApiProfile();

export function updateContractSettings(name, settings) {
  return dispatch => {
    ProfileApi.updateContractSettings(name, settings)
      .then(json => dispatch({
        type: UPDATE_PROFILE_AVAILABLE,
        profile: json,
      }))
      .catch(err => {
        profileErrorHandler(err, dispatch);
      });
  };
}

export function toggleAvailable(name, available) {
  return dispatch => {
    ProfileApi.toggleAvailable(name, available)
      .then(json => dispatch({
        type: UPDATE_PROFILE_AVAILABLE,
        profile: json,
      }))
      .catch(err => {
        profileErrorHandler(err, dispatch);
      });
  };
}

export function updateProfile(profile) {
  return dispatch =>
    dispatch({
      type: UPDATE_PROFILE,
      profile,
    });
}

export function getProfilePageInfo(name) {
  return async dispatch => {
    try {
      const json = await ProfileApi.getProfilePageInfo(name);
      dispatch({
        type: GET_PROFILE,
        profile: json.profile,
      });
      dispatch(getFeedbacks(name));
      dispatch(getTradesForUser(name));
      dispatch(getStatsForUser(name));
    } catch(err) {
      profileErrorHandler(err, dispatch);
    }
  };
}

export function getFeedbacks(name) {
  return dispatch => {
    ProfileApi.getFeedbacks(name)
      .then(json => {
        dispatch({
          type: GET_FEEDBACKS,
          feedbacks: json.feedbacks,
        });
      })
      .catch(err => {
        profileErrorHandler(err, dispatch);
      });
  };
}

export function getStatsForUser(name) {
  return dispatch => {
    ProfileApi.getStatsForUser(name)
      .then(({stats}) =>
        dispatch({
          type: STATS_FOR_USER,
          stats,
          name,
        }));
  };
}
export function getTradesForUser(name) {
  return dispatch => {
    ProfileApi.getTradesForUser(name)
      .then(trades => {
        dispatch({
          type: TRADES_FOR_USER,
          name,
          trades: trades.orders,
        });
      })
      .catch(err => {
        profileErrorHandler(err, dispatch);
      });
  };
}

export function verifyStakeAddress(address) {
  return dispatch => {
    const web3 = window.web3;
    web3.eth.getAccounts((err, accounts) => {
      const address = accounts[0];
      if (!address) {
        console.log('no address');
        return;
      }
      dispatch(showConfirmModal('youWantEnableStaking', {address}, () => {
        const message = web3.toHex('Token Stake');
        web3.personal.sign(message, address, (err, signature) => {
          if (err) {
            console.log(err);
          } else {
            ProfileApi.verifyStakeAddress(address, signature)
              .then(() => dispatch(getStakeInfo()))
              .catch((e) => {
                if (e.apiErrorCode === ApiError.UNIQUE_VIOLATION) {
                  dispatch(showInfoModal('youCannotUseThatAddress'));
                } else {
                  console.log('unhandled error');
                }
              });
          }
        });
      }));
    });
  };
}

export function getStakeInfo() {
  return dispatch => {
    ProfileApi.getStakeInfo()
      .then((info) => {
        console.log(info);
        dispatch({
          type: GET_STAKE_INFO,
          info,
        });
      })
      .catch((error) => {
        console.log(error);
        if (error && error.apiErrorCode === -104) {
          console.log(error);
          dispatch({
            type: GET_STAKE_INFO,
            info: {verified: false},
          });
        }
      });
  };
}

export function getStakeTransactions(page, size) {
  return dispatch => {
    ProfileApi.getStakeTransactions(page, size)
      .then((info) => {
        dispatch({
          type: GET_TR_BLOCK,
          list: info.trs,
          count: info.count,
        });
      });
  };
}

export const setTrListPage = page => ({
  type: SET_TR_PAGE,
  page,
});

export const setTrListPageSize = pageSize => ({
  type: SET_TR_PAGE_SIZE,
  pageSize,
});
