import get from 'lodash/get';

import { profileErrorHandler } from '../generic/errorHandlers';
import { ApiProfile, ApiContacts} from '../generic/api';
import { ApiError} from '../generic/apiCall';
import { showConfirmModal, showTelergramVerifyCodeModal } from './modal';
import { addQuickNotif } from './quickNotif';

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
export const PROFIT_CALCULATION = 'PROFIT_CALCULATION';
export const ADD_CONTACT = 'ADD_CONTACT';
export const STAKE_RATING = 'STAKE_RATING';

const ProfileApi = new ApiProfile();
const ContactsApi = new ApiContacts();

export function verifyTelegram(value) {
  return async dispatch => {
    if (!value) {
      return;
    }
    if (value.startsWith('@')) {
      value = value.substring(1);
    }
    const result = await ContactsApi.create('telegram', value);
    if (!result.verification) {
      dispatch(addQuickNotif({
        type: 'error',
        object: {
          text: 'contactVerified',
          _id: 'contactVerified',
        },
      }));
    } else if (result.verification.type === 'code') {
      dispatch(showTelergramVerifyCodeModal(result.verification.params.code));
      dispatch({
        type: ADD_CONTACT,
        contact: result.contact,
      });
    }
  };
}

export function getStakeRating() {
  return async dispatch => {
    const rating = await ProfileApi.getStakeRating();
    dispatch({
      type: STAKE_RATING,
      rating,
    });
  };
}

export function updateNotificationSettings(settings) {
  return (dispatch, getState) => {
    const name = getState().profile.name;
    ProfileApi.updateNotificationSettings(name, settings)
      .then((profile) => dispatch({
        type: UPDATE_PROFILE,
        profile,
      }))
      .catch(err => {
        profileErrorHandler(err, dispatch);
      });
  };
}

export function updateInfo(info) {
  return (dispatch, getState) => {
    const name = getState().profile.name;
    ProfileApi.setInfo(name, info)
      .then((profile) => dispatch({
        type: UPDATE_PROFILE,
        profile,
      }))
      .catch(err => {
        profileErrorHandler(err, dispatch);
      });
  };
}

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
      .then(({stats, summary}) =>
        dispatch({
          type: STATS_FOR_USER,
          stats,
          summary,
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

export function commitToEarlyPool(amount) {
  return async (dispatch) => {
    try {
      await ProfileApi.commitToEarlyPool(amount);
      dispatch(getStakeInfo());
    } catch (err) {
      console.log(err);
    }
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
                  dispatch(addQuickNotif({
                    type: 'error',
                    object: {
                      text: 'youCannotUseThatAddress',
                      _id: 'youCannotUseThatAddress',
                    },
                  }));
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
        dispatch({
          type: GET_STAKE_INFO,
          info,
        });
      })
      .catch((error) => {
        const code = get(error, 'apiErrorCode');
        if (code === ApiError.NOT_FOUND || code === ApiError.FORBIDDEN) {
          dispatch({
            type: GET_STAKE_INFO,
            info: {verified: false},
          });
        }
      });
  };
}

export function calculateTraderProfit(trader, start, investment) {
  return dispatch => {
    ProfileApi.calculateTraderProfit(trader, start, investment)
      .then((info) => {
        dispatch({
          type: PROFIT_CALCULATION,
          info,
        });
      })
      .catch((error) => {
        console.log('failed to get');
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
