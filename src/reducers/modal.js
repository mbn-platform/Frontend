import {
  SHOW_INFORM_MODAL,
  CLOSE_INFORM_MODAL,
  SHOW_CONFIRM_MODAL,
  CLOSE_CONFIRM_MODAL,
  CLOSE_TWO_FACTOR_AUTH_MODAL,
  SHOW_TWO_FACTOR_AUTH_MODAL
} from '../actions/modal';

const modal = (state = {isInfoModalOpen: false, isConfirmModalOpen: false, modalComponent: '',  modalProps: {}}, action) => {
  switch(action.type) {
    case SHOW_INFORM_MODAL: {
      return {...state,  isInfoModalOpen: true, modalComponent: action.textID, modalProps: action.values  };
    }
    case CLOSE_INFORM_MODAL: {
      return {...state,  isInfoModalOpen: false, modalComponent: '',  modalProps: {}};
    }
    case SHOW_CONFIRM_MODAL: {
      return {...state,  isConfirmModalOpen: true, modalComponent: action.textID, modalProps: action.values, confirmCallback: action.confirmCallback  };
    }
    case CLOSE_CONFIRM_MODAL: {
      return {...state,  isConfirmModalOpen: false, modalComponent: '',  modalProps: {}};
    }
    case SHOW_TWO_FACTOR_AUTH_MODAL: {
      return {...state,
        isTwoFactorAuthModalOpen: true,
        mode: action.mode,
        authData: action.authData,
        onTwoFactorAuthSubmit: action.onTwoFactorAuthSubmit,
      };
    }
    case CLOSE_TWO_FACTOR_AUTH_MODAL: {
      return {...state,  isTwoFactorAuthModalOpen: false };
    }
    default:
      return state;
  }
};

export default modal;




