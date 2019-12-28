import React from 'react';
import { FormattedMessage } from 'react-intl';

import Funds from './ApiKeys';
import AddApiKey from './AddApiKey';
import ApiKeyInfo from './ApiKeyInfo';
import Contracts from './Contracts';
import GroupAsset from './GroupAsset';
import Offers from './Offers';
import SelectedContractInfo from './SelectedContractInfo';
import FundsChart from './FundsChart';
import SelectedContractChart from './SelectedContractChart';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedReceivedContract: null,
      selectedProvidedContract: null,
      selectedApiKey: null,
      selectedOffer: null,
    };
    this.onKeySelected = this.onKeySelected.bind(this);
    this.onOfferSelected = this.onOfferSelected.bind(this);
    this.onContractSelected = this.onContractSelected.bind(this);
    this.onContractRate = this.onContractRate.bind(this);
  }

  componentDidMount() {
    this.props.getAllRates();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  onContractRate(feedback) {
    this.props.onContractRate(feedback, this.props.userName, this.props.time);
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.apiKeys !== nextProps.apiKeys) {
      if(this.state.selectedApiKey) {
        const key = nextProps.apiKeys.ownKeys.find(k => k._id === this.state.selectedApiKey._id) || null;
        this.setState({selectedApiKey: key});
      }
    }
    if(this.props.offers !== nextProps.offers) {
      if(this.state.selectedOffer) {
        const offer = nextProps.offers.incoming.find(o => o._id === this.state.selectedOffer._id) ||
          nextProps.offers.outgoing.find(o => o._id === this.state.selectedOffer._id);
        this.setState({selectedOffer: offer});
      }
    }

    if (this.props.contracts !== nextProps.contracts) {
      if (this.state.selectedReceivedContract) {
        const findFunction = c => c._id === this.state.selectedReceivedContract._id;
        const contract = nextProps.contracts.current.find(findFunction);
        this.setState({ selectedReceivedContract: contract });
      }

      if (this.state.selectedProvidedContract) {
        const findFunction = c => c._id === this.state.selectedProvidedContract._id;
        const contract = nextProps.contracts.current.find(findFunction);
        this.setState({ selectedProvidedContract: contract });
      }
    }
  }

  render() {
    const isOffersHide = this.props.offers.outgoing.length === 0 && this.props.offers.incoming.length === 0;

    return (
      <div className="dashboard_wrapper clearfix">
        {!isOffersHide && (
          <React.Fragment>
            <div className="dashboard_block_header_title">
              <FormattedMessage id="dashboard.contractRequests" />
            </div>
            <div className="table_wrapper requests_table_wrapper">
              <Offers
                time={this.props.time}
                onOfferCanceled={this.props.onOfferCanceled}
                onOfferRejected={this.props.onOfferRejected}
                onOfferAccepted={this.props.onOfferAccepted}
                onOfferPay={this.props.onOfferPay}

                offers={this.props.offers}
                selectedOffer={this.state.selectedOffer}
                onOfferSelected={this.onOfferSelected}
              />
            </div>
          </React.Fragment>
        )}
        <div className="dashboard_block_header_title">
          <FormattedMessage
            id="dashboard.apiKeyManagement"
            defaultMessage="API KEYS Management"
          />
        </div>
        <div className="keys_tables_wrapper table_wrapper">
          <Funds
            exchangesInfo={this.props.exchangesInfo}
            userId={this.props.userId}
            apiKeys={this.props.apiKeys.ownKeys}
            selectedApiKey={this.state.selectedApiKey}
            onKeySelected={this.onKeySelected}
            onKeyDeleteClick={this.props.onKeyDeleteClick}
            exchanges={this.props.exchanges}
          />
          <AddApiKey billing={this.props.billing} />
          <ApiKeyInfo
            fund={this.state.selectedOffer || this.state.selectedApiKey}
          />
        </div>
        <div className="dashboard_block_header_title">
          <FormattedMessage
            id="dashboard.contractManagement"
            defaultMessage="Contracts Management"
          />
        </div>
        <div className="table_wrapper contracts_table_wrapper">
          <Contracts
            contracts={this.props.contracts.current}
            selectedReceivedContract={this.state.selectedReceivedContract}
            selectedProvidedContract={this.state.selectedProvidedContract}
            selectedApiKey={this.state.selectedApiKey}
            onContractSelected={this.onContractSelected}
          />
        </div>
        <div className="dashboard_block_header_title">
          <FormattedMessage
            id="dashboard.groupManagement"
            defaultMessage="Groups Management"
          />
        </div>
        <div className="table_wrapper group_asset_wrapper">
          <GroupAsset />
        </div>
        <div className="table_wrapper selected_contract_table">
          <SelectedContractInfo
            userId={this.props.userId}
            time={this.props.time}
            onContractRate={this.onContractRate}
            contract={this.state.selectedReceivedContract || this.state.selectedProvidedContract} />
        </div>
        <div className="table_wrapper traders_chart">
          <FundsChart userId={this.props.userId} apiKeys={this.props.apiKeys.ownKeys || []} exchangesInfo={this.props.exchangesInfo} contracts={this.props.contracts.current}/>
        </div>
        <div className="table_wrapper contracts_chart">
          <SelectedContractChart
            contract={this.state.selectedReceivedContract || this.state.selectedProvidedContract}
            exchangesInfo={this.props.exchangesInfo}
          />
        </div>
      </div>
    );
  }

  onKeySelected(apiKey) {
    const { selectedApiKey } = this.state;

    if (selectedApiKey === apiKey) {
      this.setState({ selectedApiKey: null });
      return;
    }

    this.setState({
      selectedApiKey: apiKey,
      selectedOffer: null,
      selectedReceivedContract: null,
      selectedProvidedContract: null,
    });
  }

  onOfferSelected(offer) {
    if(this.state.selectedOffer !== offer) {
      this.setState({
        selectedOffer: offer,
        selectedApiKey: null,
        selectedReceivedContract: null,
        selectedProvidedContract: null,
      });
    }
  }

  onContractSelected(contract) {
    const { selectedReceivedContract, selectedProvidedContract} = this.state;

    if (selectedReceivedContract && selectedReceivedContract._id === contract._id) {
      this.setState({ selectedReceivedContract: null });
      return;
    }

    if (selectedProvidedContract && selectedProvidedContract._id === contract._id) {
      this.setState({ selectedProvidedContract: null });
      return;
    }

    contract.to.name === this.props.userName
      ? this.setState({
        selectedReceivedContract: contract,
        selectedProvidedContract: null,
        selectedOffer: null
      })
      : this.setState({
        selectedReceivedContract: null,
        selectedProvidedContract: contract,
        selectedOffer: null,
      });
  }
}

export default Dashboard;
