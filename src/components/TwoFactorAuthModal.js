import React from 'react';
import PropTypes from 'prop-types';
import ModalWindow from './Modal';
import QRCode from 'qrcode.react';
import {injectIntl, FormattedMessage} from 'react-intl';
import {connect} from 'react-redux';
import { closeTwoFactorAuthModal, disable2FA, confirm2FA } from '../actions/modal';

class TwoFactorAuthModal extends React.Component {
  state = {
    isInfoModalOpen: this.props.modal.isTwoFactorAuthModalOpen,
    codeIsWrong: false,
    currentCode: '',
    firstAutoSubmit: true,
  };

  static propTypes = {
    modal: PropTypes.shape({
      mode: PropTypes.string,
    }),
    onTwoFactorAuthSubmit: PropTypes.func,
    secret: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
  };

  static defaultProps = {
    modal: {},
    secret: '',
    onTwoFactorAuthSubmit: () => ({}),
  };


  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.modal.isTwoFactorAuthModalOpen !== prevState.isInfoModalOpen) {
      return {
        success2FA: false,
        isInfoModalOpen: nextProps.modal.isTwoFactorAuthModalOpen,
      };
    }
    return null;
  }

  onChangeAutoSubmit = e => {
    const { firstAutoSubmit } = this.state;
    const currentCode = e.target.value;
    this.setState({ currentCode: currentCode }, () => {
      if (currentCode.length <= 6) {
        this.setState({ codeIsWrong: false });
      }
      if (currentCode.length === 6 && firstAutoSubmit) {
        this.submitForm();
      }
    });
  };

  submitForm = async () => {
    const {
      closeTwoFactorAuthModalWindow,
      modal: {mode, onTwoFactorAuthSubmit},
      disable2FA,
      confirm2FA,
    } = this.props;
    const { currentCode } = this.state;
    try {
      mode === 'disable' && await disable2FA(currentCode);
      mode === 'enable' && await confirm2FA(currentCode);
      if (mode === 'disable' || mode === 'enable') {
        this.setState({success2FA: true}, () => {
          this.setState({codeIsWrong: false, currentCode: ''});
        });
      } else {
        try {
          await onTwoFactorAuthSubmit(currentCode);
          closeTwoFactorAuthModalWindow();
          this.setState({currentCode: '', codeIsWrong: false, firstAutoSubmit: true});
        } catch(e) {
          this.setState({codeIsWrong: true, firstAutoSubmit: false});
        }
      }
    } catch(e) {
      this.setState({codeIsWrong: true, firstAutoSubmit: false});
    }
  };

  onEnterPress = e => {
    const {currentCode } = this.state;
    if (e.keyCode === 13 && e.shiftKey === false && currentCode.length === 6) {
      e.preventDefault();
      this.submitForm();
    }
  }

  onPaste = e => {
    const pasteValue = e.clipboardData.getData('Text');
    if ((/^[0-9]{6}$/i).test(pasteValue)) {
      this.setState({currentCode: pasteValue.toString()}, ()=>{
        this.submitForm();
      });
    }
  }

  renderModal = () => {
    const { isInfoModalOpen, codeIsWrong, currentCode, success2FA } = this.state;
    const { closeTwoFactorAuthModalWindow,  modal: {mode, authData }, appName, appHost } = this.props;
    const { username, secret } = mode === 'enable' && authData;
    return (
      <ModalWindow
        modalIsOpen={isInfoModalOpen}
        onClose={() => {closeTwoFactorAuthModalWindow(); this.setState({currentCode: '', codeIsWrong: false, firstAutoSubmit: true});}}
        title={
          mode === 'enable' ?
            <FormattedMessage
              id="saveAndConfirmSecretCode"
              defaultMessage="Save and confirm secret code"
            />
            :
            <FormattedMessage
              id="enterConfirmationCode"
              defaultMessage="Enter confirmation code"
            />
        }
        content={
          <div className="modal__content-wrapper">
            {!success2FA ?
              <React.Fragment>
                {mode === 'enable' &&
                <div className="modal__secret-wrapper">
                  <div className="modal__qr-wrapper">
                    <QRCode
                      level="M"
                      value={`otpauth://totp/${username}@${appHost}?secret=${secret}&issuer=${appName}`}
                    />
                  </div>
                  <div className="modal__key-wrapper">
                    <FormattedMessage
                      id="yourSecretKeyIs"
                      defaultMessage="Your secret key is {br}{key}"
                      values={{key: secret, br: <br/>}}
                    />
                  </div>
                </div>
                }
                <div className="modal__input-wrapper">
                  <input onChange={this.onChangeAutoSubmit}
                    onKeyDown={this.onEnterPress}
                    onPaste={this.onPaste}
                    value={currentCode}
                    maxLength={6}
                    type="text"
                    name='ordersize'
                    className="modal__input modal__2fa-input" />
                  {codeIsWrong && <div className="modal__input-text-error">
                    <FormattedMessage
                      id="wrong2FACode"
                      defaultMessage="Wrong 2FA code"/>
                  </div>}
                </div>
              </React.Fragment> :
              <div className="modal__success-title">
                <FormattedMessage
                  id="successToggle2FA"
                  defaultMessage="Two-factor authentication successfully {action}"
                  values={{action: mode}}
                />
              </div>
            }
            <button type="submit"
              disabled={codeIsWrong}
              className="modal__button btn"
              onClick={((mode === 'disable' || mode === 'enable') && success2FA) ?
                () => {
                  closeTwoFactorAuthModalWindow();
                  this.setState({success2FA: false, currentCode: '', codeIsWrong: false, firstAutoSubmit: true});
                } :
                this.submitForm
              }>
              {this.props.intl.messages['ok']}
            </button>
          </div>
        }
      />
    );
  }

  render() {
    return this.renderModal();
  }
}

const mapDispatchToProps = {
  closeTwoFactorAuthModalWindow: closeTwoFactorAuthModal,
  disable2FA,
  confirm2FA,
};

export default injectIntl(connect(state => state, mapDispatchToProps)(TwoFactorAuthModal));
