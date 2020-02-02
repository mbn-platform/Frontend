import { reducerCreator } from 'generic/util';
import * as actions from 'actions/modal';

const initialState = {
  isInfoModalOpen: false,
  isConfirmModalOpen: false,
  isCodeInfoModalOpen: false,
  modalComponent: '',
  modalProps: {},
};

const reducerList = {
  [actions.SHOW_INFORM_MODAL]: (state, { textID, values, body }) => ({
    ...state, isInfoModalOpen: true, modalComponent: textID, modalProps: values, body,
  }),
  [actions.CLOSE_INFORM_MODAL]: (state) => ({
    ...state,  isInfoModalOpen: false, modalComponent: '',  modalProps: {},
  }),
  [actions.SHOW_CONFIRM_MODAL]: (state, { textID, values, confirmCallback, body }) => ({
    ...state,
    isConfirmModalOpen: true,
    modalComponent: textID,
    modalProps: values,
    confirmCallback,
    body,
  }),
  [actions.CLOSE_CONFIRM_MODAL]: (state) => ({
    ...state,  isConfirmModalOpen: false, modalComponent: '',  modalProps: {},
  }),
  [actions.SHOW_CODE_INFO_MODAL]: (state, { code, key, textID, titleID }) => ({
    ...state,
    isCodeInfoModalOpen: true,
    modalCode: code,
    modalKey: key,
    modalText: textID,
    modalTitle: titleID,
  }),
  [actions.CLOSE_CODE_INFO_MODAL]: (state) => ({
    ...state,  isCodeInfoModalOpen: false, modalCode: '',  modalText: '',
  }),
  [actions.SHOW_TWO_FACTOR_AUTH_MODAL]: (state, { mode, authData, onTwoFactorAuthSubmit }) => ({
    ...state,
    isTwoFactorAuthModalOpen: true,
    onTwoFactorAuthSubmit,
    authData,
    mode,
  }),
  [actions.CLOSE_TWO_FACTOR_AUTH_MODAL]: (state) => ({
    ...state,  isTwoFactorAuthModalOpen: false,
  }),
  [actions.SHOW_UPGRADE_TARIFF_MODAL]: (state, { textId, values, body }) => ({
    ...state,
    isUpgradeModalOpen: true,
    modalText: textId,
    modalProps: values,
    body,
  }),
  [actions.CLOSE_UPGRADE_TARIFF_MODAL]: (state) => ({
    ...state,  isUpgradeModalOpen: false, modalText: '',  modalProps: {},
  }),
  [actions.SHOW_COMMIT_TOKENS_MODAL]: (state) => ({
    ...state, isCommitTokensModalOpen: true,
  }),
  [actions.CLOSE_COMMIT_TOKENS_MODAL]: (state) => ({
    ...state,  isCommitTokensModalOpen: false,
  }),
  [actions.SHOW_CREATE_GROUP_MODAL]: (state) => ({
    ...state, isCreateGroupModalOpen: true,
  }),
  [actions.CLOSE_CREATE_GROUP_MODAL]: (state) => ({
    ...state, isCreateGroupModalOpen: false,
  }),
  [actions.SHOW_ADD_CONTRACT_TO_GROUP_MODAL]: (state, { group, contracts }) => ({
    ...state,
    isAddContractModalOpen: true,
    contracts,
    group,
  }),
  [actions.CLOSE_ADD_CONTRACT_TO_GROUP_MODAL]: (state) => ({
    ...state, isAddContractModalOpen: true,
  }),
};

export default reducerCreator(initialState, reducerList);
