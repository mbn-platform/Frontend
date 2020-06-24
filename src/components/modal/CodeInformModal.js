import React from 'react';
import { FormattedMessage } from 'react-intl';

import ModalWindow from '.';

export function CodeInformModal({modal, closeCodeModalWindow, intl}) {
  return (
    <ModalWindow
      modalIsOpen={modal.isCodeInfoModalOpen}
      onClose={closeCodeModalWindow}
      title={
        <FormattedMessage
          id={modal.modalTitle || 'message'}
          defaultMessage="Message"
        />
      }
      content={
        <div>
          <div className="modal__content-wrapper">
            <div className="modal__key-annotation">
              <FormattedMessage
                id={modal.modalText || 'message'}
                defaultMessage="Message"
              />
            </div>
            <div className="modal__key-wrapper">
              <div className="modal__key-item">
                <FormattedMessage
                  id="keyIs"
                  defaultMessage="Key: {key}"
                  values={{key: modal.modalKey}}
                />
              </div>
              <div className="modal__key-item">
                <FormattedMessage
                  id="secretIs"
                  defaultMessage="Secret: {secret}"
                  values={{secret: modal.modalCode}}
                />
              </div>

            </div>
            <button className="modal__button btn" onClick={closeCodeModalWindow}>
              {intl.messages['ok']}
            </button>
          </div>
        </div>
      }
    />
  );
}
