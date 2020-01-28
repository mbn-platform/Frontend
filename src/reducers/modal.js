import {
  SHOW_INFORM_MODAL,
  CLOSE_INFORM_MODAL,
  SHOW_CONFIRM_MODAL,
  CLOSE_CONFIRM_MODAL,
  CLOSE_TWO_FACTOR_AUTH_MODAL,
  SHOW_TWO_FACTOR_AUTH_MODAL,
  SHOW_CODE_INFO_MODAL,
  CLOSE_CODE_INFO_MODAL,
  SHOW_UPGRADE_TARIFF_MODAL,
  CLOSE_UPGRADE_TARIFF_MODAL,
  SHOW_COMMIT_TOKENS_MODAL,
  CLOSE_COMMIT_TOKENS_MODAL,
  SHOW_CREATE_GROUP_MODAL,
  CLOSE_CREATE_GROUP_MODAL,
  SHOW_ADD_CONTRACT_TO_GROUP_MODAL,
  CLOSE_ADD_CONTRACT_TO_GROUP_MODAL,
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
      return {...state,  isInfoModalOpen: true, modalComponent: action.textID, modalProps: action.values, body: action.body  };
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
        confirmCallback: action.confirmCallback,
        body: action.body,
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
        modalKey: action.key,
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
    case SHOW_UPGRADE_TARIFF_MODAL: {
      return {
        ...state,
        isUpgradeModalOpen: true,
        modalText: action.textId,
        modalProps: action.values,
        body: action.body,
      };
    }
    case CLOSE_UPGRADE_TARIFF_MODAL: {
      return {...state,  isUpgradeModalOpen: false, modalText: '',  modalProps: {}};
    }
    case SHOW_COMMIT_TOKENS_MODAL: {
      return {
        ...state,
        isCommitTokensModalOpen: true,
      };
    }
    case CLOSE_COMMIT_TOKENS_MODAL: {
      return {...state,  isCommitTokensModalOpen: false };
    }
    case SHOW_CREATE_GROUP_MODAL: {
      return { ...state, isCreateGroupModalOpen: true };
    }
    case CLOSE_CREATE_GROUP_MODAL: {
      return { ...state, isCreateGroupModalOpen: false };
    }

    case SHOW_ADD_CONTRACT_TO_GROUP_MODAL: {
      const { group, contracts } = action;

      return {
        ...state,
        group,
        contracts,
        isAddContractModalOpen: true,
      };
    }
    case CLOSE_ADD_CONTRACT_TO_GROUP_MODAL: {
      return { ...state, isAddContractModalOpen: false };
    }

    default:
      return state;
  }
};

export default modal;




