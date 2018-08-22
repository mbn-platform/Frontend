export const SHOW_INFORM_MODAL = 'SHOW_INFORM_MODAL';
export const CLOSE_INFORM_MODAL = 'CLOSE_INFORM_MODAL';

export const showModal = (textID='message', values={}) => ({
  type: 'SHOW_INFORM_MODAL',
  textID,
  values,
});

export const closeModal = {
  type: 'CLOSE_INFORM_MODAL',
};
