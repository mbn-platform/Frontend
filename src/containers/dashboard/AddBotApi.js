import React from 'react';
import ExchangeSelect from '../../components/ExchangeSelect';
import { connect } from 'react-redux';
import { addApiKey } from '../../actions/apiKeys';
import { injectIntl } from 'react-intl';
import {showInfoModal, showTwoFactorAuthModal} from '../../actions/modal';

class AddBotApi extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initialState();
    this.onSubmit = this.onSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleExchangeChange = this.handleExchangeChange.bind(this);
  }

  initialState() {
    return {
      label: '',
      secret: '',
      value: '',
      exchange: '',
    };
  }

  async onSubmit(event) {
    event.preventDefault();
    const { name, value, exchange, secret } = this.state;
    const { is2FAEnable, showTwoFactorAuthModal } = this.props;
    if(!name || !value || !exchange || !secret) {
      this.props.showModalWindow('dashboard.addAlert');
      return;
    }
    if (is2FAEnable) {
      showTwoFactorAuthModal('',
        {},
        async token => await this.props.onApiKeyCreated({name, key: value.trim(), exchange, secret: secret.trim()}, token)
      );
    } else {
      this.props.onApiKeyCreated({name, key: value.trim(), exchange, secret: secret.trim()});
    }
    this.setState(this.initialState());
  }

  handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({[name]: value});
  }

  handleExchangeChange(exchange) {
    this.setState({exchange: exchange});
  }

  render() {
    return (
      <div className="add_keys_form_wrapper add_bot_form_wrapper">
        <form className="add_keys_form" onSubmit={this.onSubmit}>
          <div className="add_keys_str">
            <div className="add_keys_field_wr">
              <input
                className="add_keys_field add_keys_field_name"
                onChange={this.handleChange}
                type="text"
                value={this.state.name}
                maxLength='20'
                name="label"
                placeholder={this.props.intl.messages['dashboard.label']}
                autoCorrect="off"
                spellCheck="false"
              />
            </div>
            <div className="add_keys_field_wr select_wr">
              <ExchangeSelect
                exchanges={this.props.exchanges}
                onChange={this.handleExchangeChange}
                exchange={this.state.exchange}
              />
            </div>
            <div className="keys_submit_wrapper">
              <input className="keys_submit" type="submit" value="Add key"/>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onApiKeyCreated: (key, token) => dispatch(addApiKey(key, token)),
    showModalWindow: text => dispatch(showInfoModal(text)),
    showTwoFactorAuthModal: (mode, authData, onTwoFactorAuthSubmit) => dispatch(showTwoFactorAuthModal(mode, authData, onTwoFactorAuthSubmit)),
  };
};


export default injectIntl(
  connect(state => ({
    userId: state.auth.profile._id,
    exchanges: state.exchanges,
    is2FAEnable: state.auth.profile.mfaEnabled,
  }), mapDispatchToProps)(AddBotApi));
