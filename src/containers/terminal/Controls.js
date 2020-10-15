import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';

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
  selectControlsByExchange,
} from '../../actions/terminal';
import { showInfoModal, closeInfoModal } from '../../actions/modal';

const TIME_RANGE_OPTIONS = ['1 MIN', '5 MIN', '30 MIN', '1 H', '4 H', '12 H', '1 D', '1 W'];

class Controls extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      assetGroupEnabled: false,
    };
  }

  onAssetGroupToggle = () => ({ target: { checked } }) => {
    if (!this.props.loggedIn) { return; }

    if (checked && this.props.assetGroups.length === 0) {
      this.showNoFundsModal();
    } else {
      this.setState({assetGroupEnabled: checked});
      if (checked) {
        this.handleGroupSelect(this.props.assetGroups[0]._id);
        this.props.selectFund(null);
      } else {
        this.props.selectAssetGroup(null);
      }
    }
  };

  componentDidUpdate = (prevProps) => {
    if (this.props.loggedIn !== prevProps.loggedIn) {
      this.setState({ assetGroupEnabled: false });
    }

    if (this.props.loggedIn &&
      this.props.assetGroup && !this.state.assetGroupEnabled ) {
      this.setState({ assetGroupEnabled: true});
    };
  };

  handleGroupSelect = groupId => {
    const group = this.props.assetGroups.find(group => group._id === groupId);
    if (group) {
      this.props.selectAssetGroup(group);
      this.props.selectExchange(group.exchange);
      this.props.getExchangeMarkets(group.exchange);
      this.props.selectMarket(this.props.market);
    }
  };

  handleExchangeSelect = exchange => {
    this.props.selectControlsByExchange(exchange);
    this.props.getExchangeMarkets(exchange);
    this.props.selectMarket(this.props.market);
  }

  handleFundSelect = fund => {
    this.props.selectFund(fund);
    this.props.selectExchange(fund.exchange);
    this.props.getExchangeMarkets(fund.exchange);
    this.props.selectMarket(this.props.market);
  };

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
            name="assetGroup"
            checked={this.state.assetGroupEnabled}
            title="Asset Group"
            onChange={this.onAssetGroupToggle}
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
            onContractSelect={this.props.selectFund}
          />
        ) : (
          <FundSelect
            title="apiKey"
            funds={funds}
            selectedFund={this.props.fund}
            userId={this.props.userId}
            onApiKeySelect={this.handleFundSelect}
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
          onItemSelect={this.props.selectInterval}
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
  selectInterval,
  selectFund,
  selectExchange,
  selectControlsByExchange,
  selectMarket,
  selectAssetGroup,
  showInfoModal,
  closeInfoModal,
  getExchangeMarkets,
};

export default connect(mapStateToProps, mapDispatchToProps)(Controls);

