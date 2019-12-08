import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import isNull from 'lodash/isNull';

import FundSelect from '../../components/FundSelect';
import GroupContractSelect from '../../components/GroupContractSelect';
import GroupSelect from '../../components/GroupSelect';
import DropdownSelect from '../../components/DropdownSelect';
import Checkbox from '../../components/Checkbox';
import MarketSelect from './MarketSelect';
import {
  selectExchange,
  selectMarket,
  selectFund,
  selectInterval,
  selectAssetGroup,
  getExchangeMarkets,
} from '../../actions/terminal';
import { showInfoModal, closeInfoModal } from '../../actions/modal';
import { getAssetGroups } from '../../actions/assetGroup';

const TIME_RANGE_OPTIONS = ['1 MIN', '5 MIN', '30 MIN', '1 H', '4 H', '12 H', '1 D', '1 W'];

class Controls extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      assetGroupEnabled: !isNull(props.assetGroup),
    };
  }

  onAssetGroupToggle = (checked) => {
    if (!this.props.loggedIn) { return; }

    if (checked && this.props.assetGroups.length === 0) {
      this.showNoFundsModal();
    } else {
      this.setState({assetGroupEnabled: checked});
      if (checked) {
        this.handleGroupSelect(this.props.assetGroups[0]._id);
        this.props.onApiKeySelect(null);
      } else {
        this.props.selectAssetGroup(null);
      }
    }
  };

  componentDidMount = () => {
    this.props.getAssetGroups();
  };

  componentDidUpdate = (prevProps) => {
    if (this.props.loggedIn !== prevProps.loggedIn) {
      this.setState({ assetGroupEnabled: false });
    }
  };

  handleGroupSelect = groupId => {
    const group = this.props.assetGroups.find(group => group._id === groupId);
    if (group) {
      this.props.selectAssetGroup(group);
      this.handleExchangeSelect(group.exchange);
    }
  };

  handleExchangeSelect = (exchange) => {
    this.props.onExchangeSelect(exchange);
    this.props.getExchangeMarkets(exchange);
    this.props.selectMarket(this.props.market);
  }

  showNoFundsModal = () => {
    this.props.showInfoModal('noAssetGroups', {
      link: (
        <div className="dashboard_link" onClick={this.navigateToDashboard}>
          <FormattedMessage id="dashboard.dashboard" />
        </div>
      ),
    });
  };

  navigateToDashboard = () => {
    this.props.closeInfoModal();
    this.props.history.push('/dashboard/inner');
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
        <div className={classNames('asset_groups_checkbox_wr', { 'active': this.state.assetGroupEnabled })}>
          <Checkbox
            checked={this.state.assetGroupEnabled}
            title="Asset Group"
            onToggle={this.onAssetGroupToggle}
          />
          {this.state.assetGroupEnabled && assetGroup && (
            <GroupSelect
              selectedGroup={assetGroup}
              assetGroups={assetGroups}
              targetId="group_select"
              elementClassName="exchange__switch"
              dropdownClassName="exchange"
              onItemSelect={this.handleGroupSelect}
            />
          )}
        </div>
        {this.state.assetGroupEnabled && assetGroup ? (
          <GroupContractSelect
            contracts={funds}
            group={assetGroup}
            selectedFund={this.props.fund}
            onContractSelect={this.props.onApiKeySelect}
            onAllSelected={this.handleGroupSelect}
          />
        ) : (
          <FundSelect
            title="apiKey"
            funds={funds}
            selectedFund={this.props.fund}
            userId={this.props.userId}
            onApiKeySelect={this.props.onApiKeySelect}
          />
        )}
        <DropdownSelect
          selected={this.props.exchange}
          items={this.props.exchanges}
          targetId="exchange_select"
          elementClassName="exchange__switch"
          dropdownClassName="exchange"
          onItemSelect={this.handleExchangeSelect}
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
    loggedIn: auth.loggedIn,
  };
};

const mapDispatchToProps = {
  onIntervalSelected: selectInterval,
  onExchangeSelect: selectExchange,
  onApiKeySelect: selectFund,
  selectMarket,
  getAssetGroups,
  selectAssetGroup,
  showInfoModal,
  closeInfoModal,
  getExchangeMarkets,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Controls));

