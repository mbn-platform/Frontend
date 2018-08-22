import React from 'react';
import ExchangeSelect from '../../components/ExchangeSelect';
import { connect } from 'react-redux';
import { addApiKey } from '../../actions/apiKeys';
import { injectIntl } from 'react-intl';
import {showModal} from '../../actions/modal';

class AddApiKey extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initialState();
    this.onSubmit = this.onSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleExchangeChange = this.handleExchangeChange.bind(this);
  }

  initialState() {
    return {
      name: '',
      secret: '',
      value: '',
      exchange: '',
    };
  }

  onSubmit(event) {
    event.preventDefault();
    const { name, value, exchange, secret } = this.state;
    if(!name || !value || !exchange || !secret) {
      this.props.showModalWindow('dashboard.addAlert')
      return;
    }
    this.props.onApiKeyCreated({name, key: value.trim(), exchange, secret: secret.trim()});
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
      <div className="add_keys_form_wrapper">
        <form className="add_keys_form" onSubmit={this.onSubmit}>
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
                exchanges={this.props.exchanges}
                onChange={this.handleExchangeChange}
                exchange={this.state.exchange}
              />
            </div>
            <div className="add_keys_double_field_wr clearfix">
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
    onApiKeyCreated: key => dispatch(addApiKey(key)),
    showModalWindow: text => dispatch(showModal(text)),
  };
};


export default injectIntl(
  connect(state => ({
    userId: state.auth.profile._id,
    exchanges: state.exchanges
  }), mapDispatchToProps)(AddApiKey));
