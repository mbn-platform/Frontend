import React from 'react';
import ExchangeSelect from './ExchangeSelect';
import { connect } from 'react-redux';
import { addApiKey } from '../actions/apiKeys';
import './AddApiKey.css';

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
      currencies: []
    };
  }

  onSubmit(event) {
    event.preventDefault();
    const { name, value, exchange, secret, currencies } = this.state;
    if(!name || !value || !exchange || !secret) {
      alert('enter keyname and key value, select exchange');
      return;
    }
    this.props.onApiKeyCreated({name, key: value, exchange, currencies, owner: this.props.userId, secret});
    this.setState(this.initialState());
  }

  handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({[name]: value});
  }

  handleExchangeChange(exchange) {
    this.setState({exchange: exchange.name, currencies: exchange.currencies});
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
                placeholder="Name"
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
                value={this.state.value}
                onChange={this.handleChange}
                placeholder="Key"
              />
              <input
                className="add_keys_field add_keys_field_secret"
                type="text"
                value={this.state.secret}
                name="secret"
                onChange={this.handleChange}
                placeholder="Secret"
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
    onApiKeyCreated: key => dispatch(addApiKey(key))
  };
};


export default connect(state => ({
  userId: state.auth.profile._id,
  exchanges: state.exchanges
}), mapDispatchToProps)(AddApiKey);
