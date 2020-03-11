import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';

import ExchangeSelect from 'components/ExchangeSelect';
import { addApiKey } from 'actions/apiKeys';
import { showInfoModal, showTwoFactorAuthModal } from 'actions/modal';
import LockButton from 'components/LockButton';
import { billingSelector, profileIdSelector } from 'selectors/auth';
import { mfaEnabledSelector } from 'selectors/auth';
import { exchangesSelector } from 'selectors/exchanges';

const INITIAL_STATE = {
  name: '',
  secret: '',
  value: '',
  exchange: '',
  passphrase: '',
};

class AddApiKey extends React.Component {
  state = INITIAL_STATE;

  onSubmit = async (event) => {
    event.preventDefault();
    const { name, value, exchange, secret, passphrase } = this.state;
    const { is2FAEnable, showTwoFactorAuthModal } = this.props;
    const isPhraseNotFilled = exchange === 'kucoin' && !passphrase;

    if (!name || !value || !exchange || !secret || isPhraseNotFilled) {
      this.props.showModalWindow(`dashboard.${isPhraseNotFilled ? 'addPassphrase' : 'addAlert'}`);

      return;
    }

    if (is2FAEnable) {
      showTwoFactorAuthModal('',
        {},
        async token => await this.props.onApiKeyCreated(this.state, token)
      );
    } else {
      this.props.onApiKeyCreated(this.state);
    }

    this.setState(INITIAL_STATE);
  }

  handleChange = (event) => {
    const { name, value } = event.target;

    this.setState({ [name]: value });
  }

  handleExchangeChange = (exchange) => {
    this.setState({ exchange });
  }

  render() {
    const { apiKeys } = this.props.billing;
    const { exchange } = this.state;

    return (
      <div className="add_keys_form_wrapper">
        <form onSubmit={this.onSubmit}>
          <div className="add_keys_str">
            <div className="add_keys_field_wr">
              <input
                className="add_keys_field add_keys_field_name"
                onChange={this.handleChange}
                type="text"
                value={this.state.name}
                maxLength='20'
                name="name"
                placeholder={this.props.intl.messages['dashboard.namePlaceholder']}
                autoCorrect="off"
                spellCheck="false"
              />
            </div>
            <div className="add_keys_field_wr select_wr">
              <ExchangeSelect
                defaultPlaceholder={this.props.intl.messages['dashboard.exchange']}
                exchanges={this.props.exchanges}
                onChange={this.handleExchangeChange}
                exchange={this.state.exchange}
              />
            </div>
            <div className="add_keys_double_field_wr clearfix">
              <div>
                <input className="add_keys_field add_keys_field_key"
                  type="text"
                  name="value"
                  autoComplete="off"
                  value={this.state.value}
                  onChange={this.handleChange}
                  placeholder={this.props.intl.messages['dashboard.keyPlaceholder']}
                  autoCorrect="off"
                  spellCheck="false"
                />
                <input
                  className="add_keys_field add_keys_field_secret"
                  type="text"
                  value={this.state.secret}
                  name="secret"
                  autoComplete="off"
                  onChange={this.handleChange}
                  placeholder={this.props.intl.messages['dashboard.secretPlaceholder']}
                  autoCorrect="off"
                  spellCheck="false"
                />
              </div>
              {exchange === 'kucoin' && (
                <div className="add_keys_kucoin_field_wr">
                  <input
                    className="add_keys_field add_keys_field_name"
                    onChange={this.handleChange}
                    type="text"
                    value={this.state.passphrase}
                    name="passphrase"
                    placeholder={this.props.intl.messages['dashboard.passphrasePlaceholder']}
                    autoCorrect="off"
                    spellCheck="false"
                  />
                </div>
              )}
            </div>
            <div className="keys_submit_wrapper">
              <LockButton
                offsetTop="calc(50% - 15px)"
                offsetLeft="-30px"
                {...apiKeys}
              >
                <input className="keys_submit" type="submit" value="Add key"/>
              </LockButton>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  userId: profileIdSelector(state),
  exchanges: exchangesSelector(state),
  is2FAEnable: mfaEnabledSelector(state),
  billing: billingSelector(state),
});

const mapDispatchToProps = {
  onApiKeyCreated: addApiKey,
  showModalWindow: showInfoModal,
  showTwoFactorAuthModal,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(AddApiKey));
