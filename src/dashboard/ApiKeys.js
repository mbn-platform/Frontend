import React from 'react';
import { connect } from 'react-redux';
import { deleteApiKey } from '../actions/apiKeys';
import PropTypes from 'prop-types';
const availablePairs = ['BTC-BCC', 'BTC-NEO', 'BTC-ETH'];

class ApiKeys extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 0,
      ownedKeys: this.props.apiKeys.filter(k => k.owned),
      sharedKeys: this.props.apiKeys.filter(k => !k.owned)
    };
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.selectedApiKey && nextProps.selectedApiKey !== this.props.selectedApiKey) {
      const requiredTab = nextProps.selectedApiKey.owned ? 0 : 1;
      if(this.state.selectedTab !== requiredTab) {
        this.setState({selectedTab: requiredTab});
      }
    }
    if(nextProps.apiKeys !== this.props.apiKeys) {
      this.setState({
        ownedKeys: nextProps.apiKeys.filter(k => k.owned),
        sharedKeys: nextProps.apiKeys.filter(k => !k.owned)
      });
    }
  }

  render() {
    return (
      <div>
        <h2 style={{display: 'inline'}}>Api Keys</h2>
        <button onClick={() => this.setState({selectedTab: 0})}>My Keys ({this.state.ownedKeys.length})</button>
        <button onClick={() => this.setState({selectedTab: 1})}>Received keys ({this.state.sharedKeys.length})</button>
        {this.renderContent()}
      </div>
    );
  }

  renderContent() {
    const { apiKeys, onKeyDeleteClick } = this.props;
    if(apiKeys.length === 0) {
      return (<div>You have no keys yet</div>);
    } else {
      const selectedTab = this.state.selectedTab;
      const keys = selectedTab ? this.state.sharedKeys : this.state.ownedKeys;
      return (
        <ul>
          {keys.map(apiKey => (
            <ApiKey key={apiKey.keyId} apiKey={apiKey}
            onKeySelected={this.props.onKeySelected}
            onKeyDeleteClick={onKeyDeleteClick} selected={apiKey == this.props.selectedApiKey}/>
          ))}
        </ul>
      );

    }
  }
}

ApiKeys.propTypes = {
  onKeySelected: PropTypes.func.isRequired,
  onKeyDeleteClick: PropTypes.func.isRequired,
  apiKeys: PropTypes.array.isRequired,
  selectedKey: PropTypes.object
};

class ApiKey extends React.Component {
  constructor(props) {
    super(props);
    this.state = {pairsOpened: false};
    this.onKeyDeleteClick = this.onKeyDeleteClick.bind(this);
  }

  onPairsClicked() {
    this.setState(prev => {
      return {pairsOpened: !prev.pairsOpened};
    });
  }
  render() {
    const apiKey = this.props.apiKey;
    return (
      <li style={this.props.selected ? {backgroundColor: 'aqua'} : {}} onClick={() => this.props.onKeySelected(apiKey)}>
        <span>{apiKey.name} </span>
        <span>{apiKey.keyValue} </span>
        <span>{apiKey.exchange} </span>
        <span>{apiKey.inUse ? 'in use' : 'free'} </span>
        <br/>
        {apiKey.owned ? <button onClick={this.onKeyDeleteClick}>Delete</button> : null}

      </li>
    );
  }

  onKeyDeleteClick(event) {
    event.stopPropagation();
    this.props.onKeyDeleteClick(this.props.apiKey);
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

export default ApiKeys;
