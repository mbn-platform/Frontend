import React from 'react';
import PropTypes from 'prop-types';
import ModalWindow from '../../components/Modal';
import {injectIntl, FormattedMessage} from 'react-intl';

class TwoFactorAuthModal extends React.Component {
  state = {
    isInfoModalOpen: true,
    codeIsWrong: false,
    currentCode: '',
    firstAutoSubmit: true,
  };

  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
  };

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
    const { onSubmit } = this.props;
    const { currentCode } = this.state;
    try {
      await onSubmit(currentCode);
      this.setState({isInfoModalOpen: false});
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

    return (
      <ModalWindow
        modalIsOpen={isInfoModalOpen}
        onClose={() => this.setState({isInfoModalOpen: false})}
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

export default injectIntl(TwoFactorAuthModal);
