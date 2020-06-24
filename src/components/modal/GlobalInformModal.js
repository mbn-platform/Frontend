import React from 'react';
import { FormattedMessage } from 'react-intl';

import ModalWindow from '.';

export function GlobalInformModal({modal, closeInfoModalWindow, intl}) {
  if (!modal.isInfoModalOpen) {
    return null;
  }
  return (
    <ModalWindow
      modalIsOpen={modal.isInfoModalOpen}
      onClose={closeInfoModalWindow}
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
          <button className="modal__button btn" onClick={closeInfoModalWindow}>
            {intl.messages['ok']}
          </button>
        </div>
      }
    />
  );
}
