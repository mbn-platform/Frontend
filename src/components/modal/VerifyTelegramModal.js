import React from 'react';
import { FormattedMessage } from 'react-intl';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {connect} from 'react-redux';
import { closeTelegramVerifyCodeModal } from '../../actions/modal';

import ModalWindow from '.';

export function VerifyTelegramModal({modal, closeTelegramVerifyCodeModal, intl}) {
  if (!modal.isTelegramModalOpen) {
    return null;
  }
  const bot = process.env.REACT_APP_BOT_NAME;
  const botRef = `https://t.me/${bot}`;
  return (
    <ModalWindow
      modalIsOpen={modal.isTelegramModalOpen}
      onClose={closeTelegramVerifyCodeModal}
      title={
        <FormattedMessage
          id='telegramConfirm.title'
          defaultMessage="Message"
          values={modal.modalProps}
        />
      }
      content={
        <div className="text-center">
          <div className="modal__body_text">
            <FormattedMessage
              id='telegramConfirm.body'
              values={{
                code: modal.code,
                link: <a target="__blank" href={botRef}> our bot </a>,
              }}
            />
          </div>
          <CopyToClipboard text={modal.code}>
            <button className="modal__button btn">
              {intl.messages['telegramConfirm.copyCode']}
            </button>
          </CopyToClipboard>
        </div>
      }
    />
  );
}
const mapDispatchToProps = {
  closeTelegramVerifyCodeModal,
};
export default connect(null, mapDispatchToProps)(VerifyTelegramModal);
