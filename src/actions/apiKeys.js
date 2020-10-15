import { ApiError } from '../generic/apiCall';
import defaultErrorHandler from '../generic/errorHandlers';
import { LOGGED_OUT } from './auth';
import {UPDATE_KEYS} from './dashboard';
import {SELECT_FUND} from './terminal';
import { ApiKeys, ApiBotKeys } from '../generic/api';
import { showCodeModal, showUpgradeTariffModal } from './modal';
import { addQuickNotif } from './quickNotif';
export const DELETE_API_KEY = 'DELETE_API_KEY';
export const ADD_API_KEY = 'ADD_API_KEY';
export const UPDATE_API_KEY = 'UPDATE_API_KEY';
export const UPDATE_API_KEY_BALANCE = 'UPDATE_API_KEY_BALANCE';
export const UPDATE_BOT_KEYS = 'UPDATE_BOT_KEYS';
export const ADD_BOT_KEYS = 'ADD_BOT_KEYS';
export const DELETE_BOT_KEYS = 'DELETE_BOT_KEYS';

const KeysApi = new ApiKeys();
const KeysBotApi = new ApiBotKeys();

export function fetchKeys() {
  return dispatch => {
    KeysApi.fetch()
      .then(json => dispatch({
        type: UPDATE_KEYS,
        data: json.own
      }))
      .catch(err => {
        defaultErrorHandler(err, dispatch);
      });
  };
}

export function fetchBotKeys() {
  return dispatch => {
    KeysBotApi.fetch()
      .then(data => dispatch({
        type: UPDATE_BOT_KEYS,
        data
      }))
      .catch(err => {
        defaultErrorHandler(err, dispatch);
      });
  };
}

export function deleteBotKeys(keyID) {
  return dispatch => {
    KeysBotApi.delete(keyID)
      .then(() => dispatch({
        type: DELETE_BOT_KEYS,
        keyID
      }))
      .catch(err => {
        defaultErrorHandler(err, dispatch);
      });
  };
}

export function addBotKeys(label, keyId) {
  return async dispatch => {
    try {
      const data = await KeysBotApi.add(label, keyId);
      dispatch({
        type: ADD_BOT_KEYS,
        data
      });
      dispatch(showCodeModal('yourBotSecretTitle', 'saveYourCode', data.secret, data._id));
    } catch(err) {
      defaultErrorHandler(err, dispatch);
    }
  };
}

export function deleteApiKey(key, token2FA) {
  return async (dispatch, getState) => {
    if (key.inUse) {
      dispatch(addQuickNotif({
        type: 'error',
        object: {
          text: 'dashboard.cannotDeleteKey',
          _id: 'dashboard.cannotDeleteKey',
        },
      }));
      return;
    }
    await KeysApi.delete(key, token2FA)
      .then(() => {
        const selectedKey = getState().terminal.fund;

        if (selectedKey && selectedKey._id === key._id) {
          const exchange = getState().terminal.exchange;
          const ownKeys = getState().apiKeys.ownKeys.filter(key => key.exchange === exchange);
          let currentKeyIndex = ownKeys.findIndex(k => k._id === selectedKey._id);
          let newSelectedKey = null;
          if (ownKeys.length > 1) {
            newSelectedKey = (currentKeyIndex === (ownKeys.length - 1) ? ownKeys[currentKeyIndex - 1] : ownKeys[currentKeyIndex + 1]);
          }
          dispatch({
            type: SELECT_FUND,
            fund: newSelectedKey
          });
        }
        dispatch({
          type: DELETE_API_KEY,
          apiKey: key,
        });
      })
      .catch(error => {
        if (error.apiErrorCode) {
          switch (error.apiErrorCode) {
            case ApiError.FORBIDDEN: {
              dispatch({
                type: LOGGED_OUT,
              });
              throw error;
            }
            case ApiError.KEY_IN_USE:
              dispatch(addQuickNotif({
                type: 'error',
                object: {
                  text: 'theKeyIsInUse',
                  _id: 'theKeyIsInUse',
                },
              }));
              break;
            default:
              console.error('unhandled api error', error.apiErrorCode);
              throw error;
          }
        } else {
          console.error('error deleting key', error);
          throw error;
        }
      });
  };
}

export function addApiKey(key, token2FA) {
  return async (dispatch, getState) => {
    const params = {
      name: key.name,
      exchange: key.exchange,
      key: key.value.trim(),
      secret: key.secret.trim(),
      extra: {
        passphrase: key.passphrase.trim(),
      },
    };

    try {
      await KeysApi.add(params, token2FA)
        .then(json => {
          dispatch(addQuickNotif({
            type: 'success',
            object: {
              text: 'notification.apiKeyAdded',
              _id: 'notification.apiKeyAdded',
            },
          }));
          dispatch({
            type: ADD_API_KEY,
            apiKey: json,
          });
          const ownKeys = getState().apiKeys.ownKeys;

          if (ownKeys.length === 1) {
            dispatch({
              type: SELECT_FUND,
              fund: ownKeys[0]
            });
          }
        });
    } catch(error) {
      if (error.apiErrorCode) {
        switch(error.apiErrorCode) {
          case ApiError.INVALID_PARAMS_SET:
            dispatch(addQuickNotif({
              type: 'error',
              object: {
                text: 'invalidKeySecretPair',
                _id: 'invalidKeySecretPair',
              },
            }));
            break;
          case ApiError.UNIQUE_VIOLATION:
            dispatch(addQuickNotif({
              type: 'error',
              object: {
                text: 'thisKeyAlreadyInSystem',
                _id: 'thisKeyAlreadyInSystem',
              },
            }));
            break;
          case ApiError.TARIFF_LIMIT:
            dispatch(showUpgradeTariffModal('profile.needToUpgradePlan',
              {},
              {
                upgradeTariffText: 'profile.upgrade',
                cancelText: 'profile.cancel',
              },
            ));
            break;
          case ApiError.MAINTENANCE:
            dispatch(addQuickNotif({
              type: 'error',
              object: {
                text: 'exchange.maintenance',
                _id: 'exchange.maintenance',
              },
            }));
            break;
          default:
            dispatch(addQuickNotif({
              type: 'error',
              object: {
                text: 'exchange.maintenance',
                _id: 'exchange.maintenance',
                values: {errorCode: error.apiErrorCode},
              },
            }));
        }
      }
    }
  };
}

export function updateApiKey(key) {
  return dispatch => {
    KeysApi.update(key)
      .then(apiKey => {
        dispatch({
          type: UPDATE_API_KEY,
          apiKey,
        });
      })
      .catch(err => {
        console.error(err.apiErrorCode);
      });
  };
}

export function updateKeyBalance(_id, balances, totalInBTC, totalInUSDT) {
  return {
    type: UPDATE_API_KEY_BALANCE,
    _id,
    balances,
    totalInBTC,
    totalInUSDT,
  };
}
