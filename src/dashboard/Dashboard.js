import React from 'react';
import Funds from './ApiKeys';
import AddApiKey from './AddApiKey';
import ApiKeyInfo from './ApiKeyInfo';
import Contracts from './Contracts';
import Offers from './Offers';
import SelectedContractInfo from './SelectedContractInfo';
import TradersChart from './TradersChart';
import ContractsChart from './ContractsChart';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {selectedContract: null, selectedApiKey: null, selectedOffer: null};
    this.onKeySelected = this.onKeySelected.bind(this);
    this.onOfferSelected = this.onOfferSelected.bind(this);
    this.onContractSelected = this.onContractSelected.bind(this);
    this.onContractRate = this.onContractRate.bind(this);
  }

  componentDidMount() {
    this.props.updateExchanges();
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
        const key = nextProps.apiKeys.ownKeys.find(k => k._id === this.state.selectedApiKey._id) ||
          nextProps.apiKeys.receivedKeys.find(k => k._id === this.state.selectedApiKey._id);
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
    let isOwnKey;
    if(this.state.selectedApiKey && this.props.apiKeys.ownKeys.find(key => key._id === this.state.selectedApiKey._id)) {
      isOwnKey = true;
    } else {
      isOwnKey = false;
    }
    return (
      <div className="dashboard_wrapper clearfix" >
        <div className="table_wrapper requests_table_wrapper" style={{display: (this.props.offers.outgoing.length == 0 && this.props.offers.incoming.length == 0) ? 'none':'block'}}>
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
            userId={this.props.userId}
            apiKeys={this.props.apiKeys.ownKeys}
            contracts={this.props.contracts.current}
            selectedApiKey={this.state.selectedApiKey}
            onKeySelected={this.onKeySelected}
            onKeyDeleteClick={this.props.onKeyDeleteClick}
            exchanges={this.props.exchanges}
            rates={this.props.rates}
          />
          <AddApiKey/>
          <ApiKeyInfo
            apiKey={this.state.selectedApiKey}
            isOwnKey={isOwnKey}
            exchanges={this.props.exchanges}
            onKeyUpdateClick={this.props.onKeyUpdateClick}
          />

        </div>
        <div className="table_wrapper contracts_table_wrapper">
          <Contracts
            contracts={this.props.contracts}
            selectedContract={this.state.selectedContract}
            onContractSelected={this.onContractSelected}
            selectedNet={this.props.selectedNet}
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
          <TradersChart contracts={this.props.contracts}/>
        </div>
        <div className="table_wrapper contracts_chart">
          <ContractsChart contracts={this.props.contracts} />
        </div>
      </div>
    );
  }

  onKeySelected(apiKey) {
    if(!this.state.selectedApiKey || this.state.selectedApiKey._id !== apiKey._id) {
      const newState = {selectedApiKey: apiKey};
      this.setState(newState);
    }
  }

  onOfferSelected(offer) {
    if(this.state.selectedOffer !== offer) {
      this.setState({
        selectedOffer: offer
      });
    }
  }

  onContractSelected(contract) {
    if(this.state.selectedContract !== contract) {
      const newState = {
        selectedContract: contract
      };
      this.setState(newState);
    }
  }
}

export default Dashboard;
