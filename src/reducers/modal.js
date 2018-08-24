import { SHOW_INFORM_MODAL, CLOSE_INFORM_MODAL, SHOW_CONFIRM_MODAL, CLOSE_CONFIRM_MODAL } from '../actions/modal';

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
    default:
      return state;
  }
};

export default modal;




