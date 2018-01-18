import Dashboard from './Dashboard';
import { connect } from 'react-redux';
import { deleteApiKey, updateApiKey } from '../actions/apiKeys';
import { acceptOffer, cancelOffer, rejectOffer, payOffer } from '../actions/offers';
import { fetchDashboardData } from '../actions/dashboard';
import { updateExchanges } from '../actions/exchanges';
import { rateContract } from '../actions/contracts';
import { updateRates } from '../actions/terminal';

const mapStateToProps = state => {
  return {
    time: state.time,
    apiKeys: state.apiKeys,
    offers: state.offers,
    contracts: state.contracts,
    userId: state.auth.profile._id,
    userName: state.auth.profile.name,
    exchanges: state.exchanges,
    rates: state.rates,
  };
};


const mapDispatchToProps = dispatch => {
  return {
    onKeyDeleteClick: apiKey => {
      if(apiKey.inUse) {
        alert('cannot delete key - key is in use');
      } else {
        dispatch(deleteApiKey(apiKey));
      }
    },
    onKeyUpdateClick: (apiKey, original) => dispatch(updateApiKey(apiKey, original)),
    onDashboardMounted: () => {
      dispatch(fetchDashboardData());
      dispatch(updateExchanges());
    },
    onOfferPay: offer => dispatch(payOffer(offer)),
    onOfferAccepted: offer => dispatch(acceptOffer(offer)),
    onOfferRejected: offer => dispatch(rejectOffer(offer)),
    onOfferCanceled: offer => dispatch(cancelOffer(offer)),
    onContractRate: (feedback, userName, time) => dispatch(rateContract(feedback, userName, time)),
    updateRates: () => dispatch(updateRates()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
