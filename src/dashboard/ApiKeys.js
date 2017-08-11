import React from 'react';
import { connect } from 'react-redux';
import { deleteApiKey } from '../actions/apiKeys';
const availablePairs = ['BTC-BCC', 'BTC-NEO', 'BTC-ETH'];

const ApiKeys = ({ apiKeys, onKeyDeleteClick }) => {
  if(apiKeys.length === 0) {
    return (<div>You have no keys yet</div>);
  } else {
    return (
      <ul>
        {apiKeys.map(apiKey => <ApiKey key={apiKey.keyId} apiKey={apiKey} onKeyDeleteClick={onKeyDeleteClick} />)}
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
      <li>
        <span>{apiKey.name} </span>
        <span>{apiKey.keyValue} </span>
        <span>{apiKey.exchange} </span>
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
      return (<PairsForm availablePairs={availablePairs} pairs={this.props.apiKey.pairs}/>);
    } else {
      return null;
    }
  }
}


class PairsForm extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        {this.props.availablePairs.map(pair => this.renderPair(pair))}
      </div>
    );
  }

  renderPair(pair) {
    const pairEnabled = this.props.pairs.indexOf(pair) !== -1;
    return (<label><input type="checkbox" defaultChecked={pairEnabled}/>{pair}</label>);
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
