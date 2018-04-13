import React from 'react';
import ApiKeySelect from '../terminal/ApiKeySelect';
import DropdownSelect from '../terminal/DropdownSelect';

class Controls extends React.Component {
  render() {
    return (
      <div className="row dropdowns pt-2">
        <ApiKeySelect
          container=".orders.container-fluid"
          apiKeys={this.props.apiKeys}
          selectedKey={this.props.apiKey}
          onApiKeySelect={this.props.onApiKeySelect}
        />
        <DropdownSelect
          selected={this.props.exchange}
          items={['bittrex']}
          targetId="exchange_select"
          elementClassName="exchange__switch"
          dropdownClassName="exchange"
          onItemSelect={this.props.onExchangeSelect}
        />
      </div>
    );
  }
}

export default Controls;
