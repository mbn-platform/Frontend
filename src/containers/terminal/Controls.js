import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import { isNil, compose } from 'ramda';

import FundSelect from 'components/FundSelect';
import GroupContractSelect from 'components/GroupContractSelect';
import GroupSelect from 'components/GroupSelect';
import DropdownSelect from 'components/DropdownSelect';
import Checkbox from 'components/Checkbox';
import MarketSelect from './MarketSelect';
import {
  selectExchange,
  selectMarket,
  selectFund,
  selectInterval,
  selectAssetGroup,
  getExchangeMarkets,
  selectControlsByExchange,
} from 'actions/terminal';
import { showInfoModal, closeInfoModal } from 'actions/modal';
import { getAssetGroups } from 'actions/assetGroup';
import { assetGroupsSelector } from 'selectors/assetGroups';
import {
  fundsSelector, exchangeSelector, fundSelector,
  marketSelector, intervalSelector, assetGroupSelector,
} from 'selectors/terminal';
import { loggedInSelector } from 'selectors/auth';
import { exchangesSelector } from 'selectors/exchangesInfo';

const TIME_RANGE_OPTIONS = ['1 MIN', '5 MIN', '30 MIN', '1 H', '4 H', '12 H', '1 D', '1 W'];

class Controls extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      assetGroupEnabled: !isNil(props.assetGroup),
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
        this.props.selectFund(null);
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

    if (prevProps.assetGroup && prevProps.assetGroup !== this.props.assetGroup) {
      this.setState({ assetGroupEnabled: !isNil(this.props.assetGroup) });
    }
  };

  handleGroupSelect = groupId => {
    const group = this.props.assetGroups.find(group => group._id === groupId);
    if (group) {
      this.props.selectAssetGroup(group._id);
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
    this.props.selectFund(fund._id);
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
    const {
      assetGroup, assetGroups, fund, funds, isFullScreenEnabled,
      selectFund, exchange, exchanges, market, interval, selectInterval,
    } = this.props;
    const { assetGroupEnabled } = this.state;

    return (
      <div className={classNames('row', 'dropdowns', { 'controls-fullscreen-mode': isFullScreenEnabled })}>
        <div className={classNames('asset_groups_checkbox_wr', { 'active': assetGroupEnabled })}>
          <Checkbox
            checked={assetGroupEnabled}
            title="Asset Group"
            onToggle={this.onAssetGroupToggle}
          />
          {assetGroupEnabled && assetGroup && (
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
        {assetGroupEnabled && assetGroup ? (
          <GroupContractSelect
            contracts={funds}
            group={assetGroup}
            selectedFund={fund}
            onContractSelect={selectFund}
          />
        ) : (
          <FundSelect
            title="apiKey"
            funds={funds}
            selectedFund={fund}
            onApiKeySelect={this.handleFundSelect}
          />
        )}
        <DropdownSelect
          selected={exchange}
          items={exchanges}
          targetId="exchange_select"
          elementClassName="exchange__switch"
          dropdownClassName="exchange"
          onItemSelect={this.handleExchangeSelect}
        />
        <MarketSelect
          market={market}
          targetId="market_select"
        />
        <DropdownSelect
          selected={interval}
          items={TIME_RANGE_OPTIONS}
          targetId="time_select"
          elementClassName="time__switch"
          dropdownClassName="time"
          onItemSelect={selectInterval}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  fund: fundSelector(state),
  funds: fundsSelector(state),
  market: marketSelector(state),
  interval: intervalSelector(state),
  loggedIn: loggedInSelector(state),
  exchange: exchangeSelector(state),
  exchanges: exchangesSelector(state),
  assetGroup: assetGroupSelector(state),
  assetGroups: assetGroupsSelector(state),
});

const mapDispatchToProps = {
  selectFund,
  selectMarket,
  showInfoModal,
  closeInfoModal,
  selectInterval,
  getAssetGroups,
  selectExchange,
  selectAssetGroup,
  getExchangeMarkets,
  selectControlsByExchange,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withRouter,
)(Controls);
