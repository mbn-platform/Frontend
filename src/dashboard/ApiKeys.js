import React from 'react';
import { connect } from 'react-redux';
import { deleteApiKey } from '../actions/apiKeys';
const availablePairs = ['ETH/BTC', 'BTC/USD', 'ETH/USD'];

const ApiKeys = ({ apiKeys, onKeyDeleteClick }) => {
  if(apiKeys.length === 0) {
    return (<div>You have no keys yet</div>);
  } else {
    return (
      <ul>
        {apiKeys.map(apiKey => <ApiKey key={Math.random()} apiKey={apiKey} onKeyDeleteClick={onKeyDeleteClick} />)};
      </ul>
      );
  }
}

class ApiKey extends React.Component {
  constructor(props) {
    super(props);
    this.state = {pairsOpened: false};
    this.onPairsClicked = this.onPairsClicked.bind(this);
  }

  onPairsClicked() {
    this.setState(prev => {
      return {pairsOpened: !prev.pairsOpened};
    });
  }
  render() {
    const apiKey = this.props.apiKey;
    return (
      <li key={Math.random()}>
        <span>{apiKey.keyName} </span>
        <span>{apiKey.keyValue} </span>
        <span>{apiKey.stock} </span>
        <span>{apiKey.pairs} </span>
        <span>{apiKey.inUse ? 'in use' : 'free'} </span>
        <br/>
        <button onClick={this.onPairsClicked}>Pairs</button>
        {this.renderPairs()}
        <br/>
        <button onClick={() => this.props.onKeyDeleteClick(apiKey)}>Delete</button>
      </li>
     );
  }

  renderPairs() {
    if(this.state.pairsOpened) {
      return (
        <div>
          {availablePairs.map(pair => <label><input type="checkbox"/>{pair}</label>)}
        </div>
      );
    } else {
      return null;
    }
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onKeyDeleteClick: apiKey => {
      if(apiKey.inUse) {
        alert('cannot delete key - key is in use');
      } else {
        dispatch(deleteApiKey(apiKey));
      }
    }
  }
}

const mapStateToProps = state => {
  return {
    apiKeys: state.apiKeys
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ApiKeys);
