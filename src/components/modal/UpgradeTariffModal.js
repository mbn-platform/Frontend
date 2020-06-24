import React from 'react';
import { FormattedMessage } from 'react-intl';

import ModalWindow from './ModalWindow';

export function UpgradeTariffModal({modal, closeUpgradeTariffModalWindow, history, intl}) {

  if (!modal.isUpgradeModalOpen) {
    return null;
  }

  return (
    <ModalWindow
      modalIsOpen={modal.isUpgradeModalOpen}
      onClose={closeUpgradeTariffModalWindow}
      title={
        <FormattedMessage
          id={modal.modalText}
          values={modal.modalProps}
        />
      }
      content={
        <div>
          <button className="modal__button btn" onClick={() => {
            history.push('/tariffs');
            closeUpgradeTariffModalWindow();
          }}>
            <FormattedMessage id={modal.body.upgradeTariffText} />
          </button>
          <button className="modal__button btn" onClick={closeUpgradeTariffModalWindow}>
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
