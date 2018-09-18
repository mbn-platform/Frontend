import {
  SHOW_INFORM_MODAL,
  CLOSE_INFORM_MODAL,
  SHOW_CONFIRM_MODAL,
  CLOSE_CONFIRM_MODAL,
  CLOSE_TWO_FACTOR_AUTH_MODAL,
  SHOW_TWO_FACTOR_AUTH_MODAL,
  SHOW_CODE_INFO_MODAL,
  CLOSE_CODE_INFO_MODAL,
} from '../actions/modal';

const modal = (
  state = {
    isInfoModalOpen: false,
    isConfirmModalOpen: false,
    isCodeInfoModalOpen: false,
    modalComponent: '',
    modalProps: {}
  }, action) => {
  switch(action.type) {
    case SHOW_INFORM_MODAL: {
      return {...state,  isInfoModalOpen: true, modalComponent: action.textID, modalProps: action.values  };
    }
    case CLOSE_INFORM_MODAL: {
      return {...state,  isInfoModalOpen: false, modalComponent: '',  modalProps: {}};
    }
    case SHOW_CONFIRM_MODAL: {
      return {
        ...state,
        isConfirmModalOpen: true,
        modalComponent: action.textID,
        modalProps: action.values,
        confirmCallback: action.confirmCallback
      };
    }
    case CLOSE_CONFIRM_MODAL: {
      return {...state,  isConfirmModalOpen: false, modalComponent: '',  modalProps: {}};
    }
    case SHOW_CODE_INFO_MODAL: {
      return {
        ...state,
        isCodeInfoModalOpen: true,
        modalCode: action.code,
        modalText: action.textID,
        modalTitle: action.titleID
      };
    }
    case CLOSE_CODE_INFO_MODAL: {
      return {...state,  isCodeInfoModalOpen: false, modalCode: '',  modalText: ''};
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




