import React from 'react';
import ExchangeSelect from '../../components/ExchangeSelect';
import { connect } from 'react-redux';
import { addBotKeys } from '../../actions/apiKeys';
import { injectIntl } from 'react-intl';
import {showInfoModal, showTwoFactorAuthModal} from '../../actions/modal';

class AddBotApi extends React.Component {
  state = {
    label: '',
    chosenKeyName: '',
  };

   onSubmit = async event => {
     event.preventDefault();
     const { label, chosenKeyName } = this.state;
     const { addNewBotKeys, apiKeys } = this.props;
     if(!label || !chosenKeyName) {
       this.props.showModalWindow('dashboard.addAlert');
       return;
     }
     await addNewBotKeys(label, apiKeys.find(key => key.name === chosenKeyName)._id);
     this.setState({label: ''});
   }

  handleChange = event => {
    const value = event.target.value;
    this.setState({label: value});
  }

  handleKeyChange = keyName => {
    this.setState({chosenKeyName: keyName});
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
                value={this.state.label}
                maxLength='20'
                name="label"
                placeholder={this.props.intl.messages['dashboard.label']}
                autoCorrect="off"
                spellCheck="false"
              />
            </div>
            <div className="add_keys_field_wr select_wr">
              <ExchangeSelect
                exchanges={this.props.apiKeys.map(key => key.name)}
                onChange={this.handleKeyChange}
                defaultPlaceholder="Select key"
                exchange={this.state.chosenKeyName}
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
    addNewBotKeys: async (label, keys) => {
      dispatch(await addBotKeys(label, keys));
    },
    showModalWindow: text => dispatch(showInfoModal(text)),
    showTwoFactorAuthModal: (mode, authData, onTwoFactorAuthSubmit) => dispatch(showTwoFactorAuthModal(mode, authData, onTwoFactorAuthSubmit)),
  };
};


export default injectIntl(
  connect(state => ({
    userId: state.auth.profile._id,
    exchanges: state.exchanges,
    apiKeys: state.apiKeys.ownKeys,
    is2FAEnabled: state.auth.profile.mfaEnabled,
  }), mapDispatchToProps)(AddBotApi));
