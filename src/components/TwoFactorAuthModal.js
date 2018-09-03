import React from 'react';
import PropTypes from 'prop-types';
import ModalWindow from './Modal';
import {injectIntl, FormattedMessage} from 'react-intl';
import {connect} from 'react-redux';
import { closeTwoFactorAuthModal } from '../actions/modal';

class TwoFactorAuthModal extends React.Component {
  state = {
    isInfoModalOpen: this.props.modal.isTwoFactorAuthModalOpen,
    codeIsWrong: false,
    currentCode: '',
    firstAutoSubmit: true,
  };

  static propTypes = {
    onTwoFactorAuthSubmit: PropTypes.func.isRequired,
  };


  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.modal.isTwoFactorAuthModalOpen !== prevState.isInfoModalOpen) {
      return {
        isInfoModalOpen: nextProps.modal.isTwoFactorAuthModalOpen
      };
    }
    return null;
  }

  onChangeAutoSubmit = e => {
    const { firstAutoSubmit } = this.state;
    const currentCode = e.target.value;
    if (currentCode.length <= 6) {
      this.setState({currentCode, codeIsWrong: false});
    } else {
      this.setState({ currentCode: currentCode.slice(0, 6) });
    }
    if (currentCode.length === 6 && firstAutoSubmit) {
      this.submitForm();
    }
  };

  submitForm = async () => {
    const { onTwoFactorAuthSubmit, closeTwoFactorAuthModalWindow } = this.props;
    const { currentCode } = this.state;
    try {
      await onTwoFactorAuthSubmit(currentCode);
      closeTwoFactorAuthModalWindow();
    } catch(e) {
      this.setState({codeIsWrong: true, firstAutoSubmit: false});
    }
  };

  onEnterPress = e => {
    const {currentCode} = this.state;
    if (e.keyCode === 13 && e.shiftKey === false && currentCode.length === 6) {
      e.preventDefault();
      this.submitForm();
    }
  }
  
  onPaste = e => {
    const pasteValue = e.clipboardData.getData('Text');
    if ((/^[0-9]{6}$/i).test(pasteValue)) {
      this.submitForm();
    }
  }

  renderModal = () => {
    const { isInfoModalOpen, codeIsWrong, currentCode } = this.state;
    const { closeTwoFactorAuthModalWindow } = this.props;
    return (
      <ModalWindow
        modalIsOpen={isInfoModalOpen}
        onClose={closeTwoFactorAuthModalWindow}
        title={
          <FormattedMessage
            id="enterConfirmationCode"
            defaultMessage="Enter confirmation code"
          />
        }
        content={
          <div className="modal__content-wrapper">
            <div className="modal__input-wrapper">
              <input onChange={this.onChangeAutoSubmit}
                onKeyDown={this.onEnterPress}
                onPaste={this.onPaste}
                value={currentCode}
                type="number"
                name='ordersize'
                className="modal__input modal__2fa-input" />
              {codeIsWrong && <div className="modal__input-text-error">
                <FormattedMessage
                  id="wrong2FACode"
                  defaultMessage="Wrong 2FA code"/>
              </div>}
            </div>
            <button type="submit" disabled={codeIsWrong} className="modal__button btn" onClick={this.submitForm}>
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

const mapDispatchToProps = dispatch => {
  return {
    closeTwoFactorAuthModalWindow: () => dispatch(closeTwoFactorAuthModal),
  };
};

export default injectIntl(connect(state => ({modal: state.modal}), mapDispatchToProps)(TwoFactorAuthModal));
