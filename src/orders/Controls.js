import React from 'react';
import ApiKeySelect from '../terminal/ApiKeySelect';

class Controls extends React.Component {
  render() {
    return (
      <div className="row dropdowns pt-2">
        <ApiKeySelect
          container=".orders.container-fluid"
          keys={this.props.apiKeys}
          selectedKey={this.props.selectedApiKey}
          onApiKeySelect={this.props.onApiKeySelect}
        />
        <div className="dropdown-link-wrap">
          <a href="#" className="dropdown-link">BITTREX <span className="arrow_down"></span></a>
          <div className="dropdown exchange">
            <div className="dropdown__name">
              <span>BITTREX</span>
              <span className="arrow_down"></span>
            </div>
            <div className="exchange__switch">Poloniex</div>
            <div className="exchange__switch">Bitfinex</div>
            <div className="exchange__switch active">BITTREX</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Controls;
