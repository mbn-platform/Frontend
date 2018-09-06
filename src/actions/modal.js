import defaultErrorHandler from '../generic/errorHandlers';
import {ApiTwoFactorAuth} from '../generic/api';
import { updateProfile } from './profile';

export const SHOW_INFORM_MODAL = 'SHOW_INFORM_MODAL';
export const SHOW_CONFIRM_MODAL = 'SHOW_CONFIRM_MODAL';
export const CLOSE_INFORM_MODAL = 'CLOSE_INFORM_MODAL';
export const CLOSE_CONFIRM_MODAL = 'CLOSE_CONFIRM_MODAL';
export const SHOW_TWO_FACTOR_AUTH_MODAL = 'SHOW_TWO_FACTOR_AUTH_MODAL';
export const CLOSE_TWO_FACTOR_AUTH_MODAL = 'CLOSE_TWO_FACTOR_AUTH_MODAL';

const Api2FA = new ApiTwoFactorAuth();

export function enableTwoFactorAuthModal() {
  return async dispatch => {
    try {
      const {secret, user: {name: username}} = await Api2FA.enable();
      return dispatch(showTwoFactorAuthModal (() => null, 'enable', {secret, username}));
    }
    catch(err){
      defaultErrorHandler(err, dispatch);
    }
  };
}

export function disableTwoFactorAuthModal() {
  return dispatch => {
    dispatch(showTwoFactorAuthModal(() => null, 'disable'));
  };
}

export function disable2FA (currentCode) {
  return async dispatch =>
    await Api2FA.disable(currentCode).then(data => dispatch(updateProfile(data.user)));
}

export function confirm2FA (currentCode) {
  return async dispatch => await Api2FA.confirm(currentCode).then(data => dispatch(updateProfile(data.user)));
}


export const showInfoModal = (textID='message', values={}) => ({
  type: 'SHOW_INFORM_MODAL',
  textID,
  values,
});

export const closeInfoModal = {
  type: 'CLOSE_INFORM_MODAL',
};

export const showConfirmModal = (textID='message', values={}, confirmCallback=()=>({})) => ({
  type: 'SHOW_CONFIRM_MODAL',
  textID,
  values,
  confirmCallback
});

export const closeConfirmModal = {
  type: 'CLOSE_CONFIRM_MODAL',
};

export const showTwoFactorAuthModal = (onTwoFactorAuthSubmit=()=>({}), mode, authData={username:'', secret:''}) => ({
  type: 'SHOW_TWO_FACTOR_AUTH_MODAL',
  onTwoFactorAuthSubmit,
  mode,
  authData,
});

export const closeTwoFactorAuthModal = {
  type: 'CLOSE_TWO_FACTOR_AUTH_MODAL',
};
