import React from 'react';
import { FormattedMessage } from 'react-intl';

import ModalWindow from '.';

export function GlobalConfirmModal({modal, closeConfirmModalWindow, intl}) {
  if (!modal.isConfirmModalOpen) {
    return null;
  }
  return (
    <ModalWindow
      modalIsOpen={modal.isConfirmModalOpen}
      onClose={closeConfirmModalWindow}
      title={
        <FormattedMessage
          id={modal.modalComponent || 'message'}
          defaultMessage="Message"
          values={modal.modalProps}
        />
      }
      content={
        <div>
          {modal.body ?
            <div className="modal__body_text">
              <FormattedMessage
                id={modal.body.textId}
                values={modal.body.values || {}}
                defaultMessage={modal.body.textId}
              />
            </div>
            : null}
          <button className="modal__button btn" onClick={() => {
            modal.confirmCallback();
            closeConfirmModalWindow();
          }}>
            {modal.body && modal.body.confirmText ?
              <FormattedMessage
                id={modal.body.confirmText}
              /> : intl.messages['yes']}
          </button>
          <button className="modal__button btn" onClick={closeConfirmModalWindow}>
            {modal.body && modal.body.cancelText ?
              <FormattedMessage
                id={modal.body.cancelText}
              /> : intl.messages['no']}
          </button>
        </div>
      }
    />
  );
}
