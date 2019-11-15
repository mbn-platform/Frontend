import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import FundSelect from '../../components/FundSelect';
import DropdownSelect from '../../components/DropdownSelect';
import MarketSelect from './MarketSelect';
import {
  selectExchange,
  selectFund,
  selectInterval,
  selectAssetGroup,
  showNoFundsModal
} from '../../actions/terminal';
import { getAssetGroups } from '../../actions/assetGroup';
import { Checkbox } from './OrdersHeader';

const TIME_RANGE_OPTIONS = ['1 MIN', '5 MIN', '30 MIN', '1 H', '4 H', '12 H', '1 D', '1 W'];

class Controls extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTime: localStorage.getItem('terminal.selectedTime') || '1 H',
      assetGroupEnabled: false,
    };
  }

  onAssetGroupToggle = (checked) => {
    if (checked && this.props.assetGroups.length === 0) {
      this.props.showNoFundsModal();
    } else {
      this.setState({assetGroupEnabled: checked});
      if (checked) {
        this.handleGroupSelect(this.props.assetGroups[0].name);
      } else {
        this.props.selectAssetGroup(null);
      }
    }
  };

  componentDidMount = () => {
    this.props.getAssetGroups();
  };

  handleGroupSelect = (groupName) => {
    const group = this.props.assetGroups.find((g) => g.name === groupName);
    if (group) {
      this.props.selectAssetGroup(group);
      this.props.onExchangeSelect(group.exchange);
    }
  };

  render() {
    const { assetGroup, assetGroups } = this.props;
    let funds;
    if (assetGroup) {
      funds = this.props.contracts.filter((c) => assetGroup.contracts.includes(c._id));
    } else {
      funds = this.props.apiKeys.concat(this.props.contracts.filter(contract => contract.to._id === this.props.userId));
    }

    return (
      <div className={classNames('row', 'dropdowns', {'controls-fullscreen-mode': this.props.isFullScreenEnabled})}>
        <Checkbox
          checked={this.state.assetGroupEnabled}
          title="Asset Group"
          onToggle={this.onAssetGroupToggle}
        />
        {this.state.assetGroupEnabled && assetGroup && (
          <DropdownSelect
            selected={assetGroup.name}
            items={assetGroups.map((g) => g.name)}
            targetId="group_select"
            elementClassName="exchange__switch"
            dropdownClassName="exchange"
            onItemSelect={this.handleGroupSelect}
          />
        )}
        <FundSelect
          title={assetGroup ? 'terminal.contracts': 'apiKey'}
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
    auth,
    exchangesInfo: {
      exchanges = [],
    },
    terminal: {
      market,
      exchange,
      ticker,
      fund,
      interval,
      assetGroup,
    },
    apiKeys: {
      ownKeys: apiKeys,
    },
    contracts: {
      current: contracts,
    },
    assetGroups,
  } = state;
  return {
    userId: auth && auth.profile ? auth.profile._id : undefined,
    exchange,
    exchanges,
    contracts,
    fund,
    apiKeys,
    ticker,
    market,
    interval,
    assetGroups: auth && auth.loggedIn ? assetGroups : null,
    assetGroup,
  };
};

const mapDispatchToProps = {
  onIntervalSelected: selectInterval,
  onExchangeSelect: selectExchange,
  onApiKeySelect: selectFund,
  getAssetGroups,
  selectAssetGroup,
  showNoFundsModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(Controls);

