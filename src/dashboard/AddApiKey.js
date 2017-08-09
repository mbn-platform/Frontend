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
      keyName: '',
      keyValue: '',
      stock: 'Bitrex'
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
    const { keyName, keyValue, stock } = this.state;
    if(!keyName || !keyValue) {
      alert('enter keyname and key value');
      return;
    }
    this.props.onApiKeyCreated({keyName, keyValue, stock, inUse: false, pairs: []});
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
          <input placeholder="Key name" name="keyName" value={this.state.keyName} onChange={this.handleChange} />
          <input placeholder="Key" name="keyValue" value={this.state.keyValue} onChange={this.handleChange} />
          <select name="stock" value={this.state.stock} onChange={this.handleChange} >
            <option>Bitrex</option>
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
}


export default connect(() => { return {}}, mapDispatchToProps)(AddApiKey);
