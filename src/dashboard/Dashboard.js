import React from 'react';
import Funds from './ApiKeys';
import AddApiKey from './AddApiKey';
import ApiKeyInfo from './ApiKeyInfo';
import Contracts from './Contracts';
import Offers from './Offers';
import SelectedContractInfo from './SelectedContractInfo';
import FundsChart from './FundsChart';
import SelectedContractChart from './SelectedContractChart';
import { CONTRACT_STATE_VERIFIED } from '../constants';
import { ETHEREUM_NET } from '../eth/MercatusFactory';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {selectedContract: null, selectedApiKey: null, selectedOffer: null};
    this.onKeySelected = this.onKeySelected.bind(this);
    this.onOfferSelected = this.onOfferSelected.bind(this);
    this.onContractSelected = this.onContractSelected.bind(this);
    this.onContractRate = this.onContractRate.bind(this);
    this.reset = this.reset.bind(this);
  }

  reset() {
    this.setState({
      selectedContract: null, selectedApiKey: null,
    });
  }

  componentDidMount() {
    this.props.updateExchanges();
    this.props.getExchangeRates('binance');
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
    if(this.props.contracts !== nextProps.contracts) {
      if(this.state.selectedContract) {
        const findFunction = c => c._id === this.state.selectedContract._id;
        const contract = nextProps.contracts.current.find(findFunction) || nextProps.contracts.finished.find(findFunction);
        this.setState({selectedContract: contract});
      }
    }

  }

  render() {
    return (
      <div className="dashboard_wrapper clearfix" >
        <div className="table_wrapper requests_table_wrapper" style={{display: (this.props.offers.outgoing.length === 0 && this.props.offers.incoming.length === 0) ? 'none':'block'}}>
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
          <AddApiKey/>
          <ApiKeyInfo
            fund={this.state.selectedOffer || this.state.selectedContract || this.state.selectedApiKey}
          />

        </div>
        <div className="table_wrapper contracts_table_wrapper">
          <Contracts
            contracts={this.props.contracts}
            selectedContract={this.state.selectedContract}
            selectedApiKey={this.state.selectedApiKey}
            onContractSelected={this.onContractSelected}
            onShowAllClicked={this.reset}
            net={ETHEREUM_NET}
            exchangesInfo={this.props.exchangesInfo}
          />
        </div>
        <div className="table_wrapper selected_contract_table">
          <SelectedContractInfo
            userId={this.props.userId}
            time={this.props.time}
            onContractRate={this.onContractRate}
            contract={this.state.selectedContract} />
        </div>
        <div className="table_wrapper traders_chart">
          <FundsChart userId={this.props.userId} apiKeys={this.props.apiKeys.ownKeys || []} exchangesInfo={this.props.exchangesInfo} contracts={this.props.contracts.current}/>
        </div>
        <div className="table_wrapper contracts_chart">
          <SelectedContractChart contract={this.state.selectedContract} exchangesInfo={this.props.exchangesInfo}/>
        </div>
      </div>
    );
  }

  onKeySelected(apiKey) {
    this.setState({selectedApiKey: apiKey, selectedContract: null, selectedOffer: null});
  }

  onOfferSelected(offer) {
    if(this.state.selectedOffer !== offer) {
      this.setState({
        selectedOffer: offer,
        selectedApiKey: null,
        selectedContract: null
      });
    }
  }

  onContractSelected(contract) {
    if(contract.state === CONTRACT_STATE_VERIFIED) {
      this.setState({selectedContract: contract, selectedOffer: null});
    } else {
      this.setState({selectedApiKey: null, selectedContract: contract, selectedOffer: null});
    }
  }
}

export default Dashboard;
