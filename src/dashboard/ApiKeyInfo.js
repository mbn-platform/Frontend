import React from 'react';
const availablePairs = ['BTC-BCC', 'BTC-NEO', 'BTC-ETH'];

class ApiKeyInfo extends React.Component {

  render() {
    console.log('render ApiKeyInfo');

    return (
      <div>
        <h2>ApiKey Info</h2>
        {this.props.apiKey ? (
        <ul>
          {availablePairs.map(p => {
          const pairEnabled = this.props.apiKey.pairs.indexOf(p) !== -1;
          return (
          <li key={p}>
            <label><input type="checkbox" checked={pairEnabled}/>{p}</label>
          </li>
          )
          })}
        </ul>
        ): (<div>No api key selected</div>)}
      </div>
      );

  }
}

export default ApiKeyInfo;
