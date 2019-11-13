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
} from '../../actions/terminal';
import { getAssetGroups } from '../../actions/assetGroup';

const TIME_RANGE_OPTIONS = ['1 MIN', '5 MIN', '30 MIN', '1 H', '4 H', '12 H', '1 D', '1 W'];

class Controls extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTime: localStorage.getItem('terminal.selectedTime') || '1 H',
    };
  }

  componentDidMount = () => {
    this.props.getAssetGroups();
  };

  handleGroupSelect = (item) => {
    const { assetGroups } = this.props;
    const group = assetGroups.find((group) => group.name === item);
    this.props.onExchangeSelect(group.exchange);
    this.props.onApiKeySelect(group);
  };

  render() {
    const funds = this.props.apiKeys.concat(this.props.contracts.filter(contract => contract.to._id === this.props.userId));
    const { assetGroup, assetGroups } = this.props;

    return (
      <div className={classNames('row', 'dropdowns', {'controls-fullscreen-mode': this.props.isFullScreenEnabled})}>
        {assetGroups && assetGroups.length > 0 && (
          <DropdownSelect
            selected={assetGroup}
            items={assetGroups.map(({ name }) => name)}
            targetId="asset_groups_select"
            elementClassName="exchange__switch"
            dropdownClassName="asset-groups"
            onItemSelect={this.handleGroupSelect}
          />
        )}
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
};

export default connect(mapStateToProps, mapDispatchToProps)(Controls);

