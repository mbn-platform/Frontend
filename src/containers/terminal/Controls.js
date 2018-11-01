import React from 'react';
import FundSelect from '../../components/FundSelect';
import DropdownSelect from '../../components/DropdownSelect';
import MarketSelect from './MarketSelect';
import classNames from 'classnames';
import {connect} from 'react-redux';
import { selectExchange, selectFund, selectInterval} from '../../actions/terminal';
const TIME_RANGE_OPTIONS = ['1 MIN', '5 MIN', '30 MIN', '1 H', '4 H', '12 H', '1 D', '1 W'];

class Controls extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedTime: localStorage.getItem('terminal.selectedTime') || '1 H',
    };
  }

  render() {
    const funds = this.props.apiKeys.concat(this.props.contracts.filter(contract => contract.to._id === this.props.userId));
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
          items={this.props.exchanges || []}
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
          selected={this.props.interval}
          items={TIME_RANGE_OPTIONS}
          targetId="time_select"
          elementClassName="time__switch"
          dropdownClassName="time"
          onItemSelect={this.props.onIntervalSelected}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  const {
    exchangesInfo: {
      exchanges = [],
    },
    terminal: {
      market,
      exchange,
      ticker,
      fund,
      interval
    },
    auth: {
      profile: {
        _id: userId,
      }
    },
    apiKeys: {
      ownKeys: apiKeys,
    },
    contracts: {
      current: contracts,
    },
  } = state;
  return {
    exchange,
    exchanges,
    contracts,
    fund,
    apiKeys,
    userId,
    ticker,
    market,
    interval,
  };
};

const mapDispatchToProps =  dispatch => ({
  onIntervalSelected: interval => dispatch(selectInterval(interval)),
  onExchangeSelect: (exchange, restore) => dispatch(selectExchange(exchange, restore)),
  onApiKeySelect: fund => dispatch(selectFund(fund)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Controls);

