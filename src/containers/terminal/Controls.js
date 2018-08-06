import React from 'react';
import FundSelect from '../../components/FundSelect';
import DropdownSelect from '../../components/DropdownSelect';
import MarketSelect from './MarketSelect';
import classNames from 'classnames';
const TIME_RANGE_OPTIONS = ['1 MIN', '5 MIN', '30 MIN', '1 H', '4 H', '12 H', '1 D', '1 W'];

class Controls extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedTime: localStorage.getItem('terminal.selectedTime') || '1 H',
    };
  }

  render() {
    const funds = this.props.apiKeys.concat(this.props.contracts.filter(contract => contract.to._id === this.props.userId))
    return (
      <div className={classNames('row', 'dropdowns', {'controls-fullscreen-mode': this.props.isFullScreenEnabled})}>
        <FundSelect
          container=".terminal.container-fluid"
          exchange={this.props.exchange}
          funds={funds}
          selectedFund={this.props.fund}
          userId={this.props.userId}
          onApiKeySelect={this.props.onApiKeySelect}
        />
        <DropdownSelect
          selected={this.props.exchange}
          items={this.props.exchanges}
          targetId="exchange_select"
          elementClassName="exchange__switch"
          dropdownClassName="exchange"
          onItemSelect={this.props.onExchangeSelect}
        />
        <MarketSelect
          market={this.props.market}
          targetId="market_select"
        />
        <DropdownSelect
          selected={this.state.selectedTime}
          items={TIME_RANGE_OPTIONS}
          targetId="time_select"
          elementClassName="time__switch"
          dropdownClassName="time"
          onItemSelect={item => {
            this.setState({selectedTime: item});
            localStorage.setItem('terminal.selectedTime', item);
          }}
        />
      </div>
    );
  }
}

export default Controls;

