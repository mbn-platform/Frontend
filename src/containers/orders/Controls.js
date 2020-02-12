import classNames from 'classnames';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { isNil } from 'ramda';

import FundSelect from 'components/FundSelect';
import GroupContractSelect from 'components/GroupContractSelect';
import GroupSelect from 'components/GroupSelect';
import DropdownSelect from 'components/DropdownSelect';
import Checkbox from 'components/Checkbox';
import {
  selectExchange,
  getExchangeMarkets,
  selectFund,
  selectMarket,
  selectAssetGroup,
  selectControlsByExchange,
} from 'actions/terminal';
import { showInfoModal, closeInfoModal } from 'actions/modal';
import { getAssetGroups } from 'actions/assetGroup';
import {
  fundsSelector, assetGroupSelector, fundSelector,
  marketSelector, exchangeSelector,
} from 'selectors/terminal';
import { assetGroupsSelector } from 'selectors/assetGroups';
import { exchangesSelector } from 'selectors/exchangesInfo';

class Controls extends React.Component {
  state = {
    assetGroupEnabled: !isNil(this.props.assetGroup),
  };

  componentDidMount = () => {
    this.props.getAssetGroups();
  };

  componentDidUpdate = (prevProps) => {
    if (prevProps.assetGroup && prevProps.assetGroup !== this.props.assetGroup) {
      this.setState({ assetGroupEnabled: !isNil(this.props.assetGroup) });
    }
  };

  onAssetGroupToggle = checked => {
    if (checked && this.props.assetGroups.length === 0) {
      this.showNoFundsModal();
    } else {
      this.setState({ assetGroupEnabled: checked });
      if (checked) {
        this.handleGroupSelect(this.props.assetGroups[0]._id);
        this.props.selectFund(null);
      } else {
        this.props.selectAssetGroup(null);
      }
    }
  };

  handleGroupSelect = groupId => {
    const { assetGroups } = this.props;
    const group = assetGroups.find(group => group._id === groupId);

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
      assetGroup, assetGroups, fund, funds,
      selectFund, exchange, exchanges,
    } = this.props;
    const { assetGroupEnabled } = this.state;

    return (
      <div className="row dropdowns pt-2">
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
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  fund: fundSelector(state),
  funds: fundsSelector(state),
  market: marketSelector(state),
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
  getAssetGroups,
  selectExchange,
  selectAssetGroup,
  getExchangeMarkets,
  selectControlsByExchange,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Controls));
