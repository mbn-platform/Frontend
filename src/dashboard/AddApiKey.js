import React from 'react';
import { connect } from 'react-redux';
import { addApiKey } from '../actions/apiKeys';

class AddApiKey extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initialState();
    this.onAddButtonClick = this.onAddButtonClick.bind(this);
    this.onCancelClick = this.onCancelClick.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  initialState() {
    return {
      opened: false,
      name: '',
      value: '',
      exchange: 'bittrex'
    };
  }

  onAddButtonClick() {
    this.setState({opened: true});
  }
  onCancelClick() {
    this.setState({opened: false});
  }

  onSubmit(event) {
    event.preventDefault();
    const { name, value, exchange } = this.state;
    if(!name || !value) {
      alert('enter keyname and key value');
      return;
    }
    this.props.onApiKeyCreated({name, key: value, exchange, pairs: [], owner: this.props.userId});
    this.setState(this.initialState());
  }

  handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({[name]: value});
  }

  render() {
    if(!this.state.opened) {
      return (<button onClick={this.onAddButtonClick}>Add key</button>);
    } else {
      return (
        <form onSubmit={this.onSubmit}>
          <input placeholder="Key name" name="name" value={this.state.name} onChange={this.handleChange} />
          <input placeholder="Key" name="value" value={this.state.value} onChange={this.handleChange} />
          <select name="exchange" value={this.state.exchange} onChange={this.handleChange} >
            <option>bittrex</option>
          </select>
          <input type="submit" value="Submit" />
          <input type="button" value="Cancel" onClick={this.onCancelClick} />
      </form>
      );
    }
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onApiKeyCreated: key => dispatch(addApiKey(key))
  };
};


export default connect(state => ({userId: state.auth.userId}), mapDispatchToProps)(AddApiKey);
