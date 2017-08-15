import React from 'react';

class ApiKeyInfo extends React.Component {

  render() {

    return (
      <div>
        <h2>ApiKey Info</h2>
        {this.props.apiKey ? (
        <ul>
          {this.props.apiKey.pairs.map(p => {
          return (
          <li key={p}>
            {p}
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
