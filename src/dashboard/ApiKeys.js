import React from 'react';
import { connect } from 'react-redux';
import { deleteApiKey } from '../actions/apiKeys';

const ApiKeys = ({ apiKeys, onKeyDeleteClick }) => {
  if(apiKeys.length === 0) {
    return (<div>You have no keys yet</div>);
  } else {
    return (
      <ul>
        {apiKeys.map(apiKey => {
        return (
        <li key={Math.random()}>
          <span>{apiKey.keyName} </span>
          <span>{apiKey.keyValue} </span>
          <span>{apiKey.stock} </span>
          <span>{apiKey.pairs} </span>
          <span>{apiKey.inUse ? 'in use' : 'free'} </span>
          <button onClick={() => onKeyDeleteClick(apiKey)}>Delete</button>
        </li>
        );
        })}
      </ul>
      )
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
