import React from 'react';
import ApiKeySelect from './ApiKeySelect';
import DropdownSelect from './DropdownSelect';
import MarketSelect from './MarketSelect';

const TIME_RANGE_OPTIONS = ['1 MIN', '5 MIN', '30 MIN', '1 H', '4 H', '12 H', '1 D', '1 W'];

class Controls extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedExchange: 'BITTREX',
      selectedTime: '1 H',
    }
  }

  render() {
    return (
      <div className="row dropdowns">
        <ApiKeySelect
          container=".terminal.container-fluid"
          keys={this.props.apiKeys}
          selectedKey={this.props.selectedApiKey}
          onApiKeySelect={this.props.onApiKeySelect}
        />
        <DropdownSelect
          selected={this.state.selectedExchange}
          items={['BITTREX']}
          targetId="exchange_select"
          elementClassName="exchange__switch"
          dropdownClassName="exchange"
          onItemSelect={item => this.setState({selectedExchange: item})}
        />
        <MarketSelect
          targetId="market_select"
        />
        <DropdownSelect
          selected={this.state.selectedTime}
          items={TIME_RANGE_OPTIONS}
          targetId="time_select"
          elementClassName="time__switch"
          dropdownClassName="time"
          onItemSelect={item => this.setState({selectedTime: item})}
        />
      </div>
    );
  }
}

export default Controls;

