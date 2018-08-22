import { SHOW_INFORM_MODAL, CLOSE_INFORM_MODAL } from '../actions/modal';

const modal = (state = {isOpen: false, modalComponent: '',  modalProps: {}}, action) => {
  switch(action.type) {
    case SHOW_INFORM_MODAL: {
      return {...state,  isOpen: true, modalComponent: action.textID, modalProps: action.values  };
    }
    case CLOSE_INFORM_MODAL: {
      return {...state,  isOpen: false, modalComponent: '',  modalProps: {}};
    }
    default:
      return state;
  }
};

export default modal;




