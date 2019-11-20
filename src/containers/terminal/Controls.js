import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';

import FundSelect, { GroupContractSelect } from '../../components/FundSelect';
import DropdownSelect from '../../components/DropdownSelect';
import Checkbox from '../../components/Checkbox';
import MarketSelect from './MarketSelect';
import {
  selectExchange,
  selectFund,
  selectInterval,
  selectAssetGroup,
} from '../../actions/terminal';
import { showInfoModal, closeInfoModal } from '../../actions/modal';
import { getAssetGroups } from '../../actions/assetGroup';

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
    if (!this.props.loggedIn) { return; }

    if (checked && this.props.assetGroups.length === 0) {
      this.showNoFundsModal();
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
    this.props.selectAssetGroup(null);
  };

  handleGroupSelect = (groupName) => {
    const group = this.props.assetGroups.find((g) => g.name === groupName);
    if (group) {
      this.props.selectAssetGroup(group);
      this.props.onExchangeSelect(group.exchange);
    }
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
            title={assetGroup ? 'terminal.contracts': 'apiKey'}
            exchange={this.props.exchange}
            funds={funds}
            selectedFund={this.props.fund}
            userId={this.props.userId}
            onApiKeySelect={this.props.onApiKeySelect}
          />
        )}
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
    loggedIn: auth.loggedIn,
  };
};

const mapDispatchToProps = {
  onIntervalSelected: selectInterval,
  onExchangeSelect: selectExchange,
  onApiKeySelect: selectFund,
  getAssetGroups,
  selectAssetGroup,
  showInfoModal,
  closeInfoModal,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Controls));

