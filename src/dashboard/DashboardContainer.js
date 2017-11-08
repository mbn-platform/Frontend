import Dashboard from './Dashboard';
import { connect } from 'react-redux';
import { deleteApiKey, updateApiKey } from '../actions/apiKeys';
import { acceptOffer, cancelOffer, rejectOffer, payOffer } from '../actions/offers';
import { fetchDashboardData } from '../actions/dashboard';
import { updateExchagnes } from '../actions/exchanges';
import { rateContract } from '../actions/contracts';

const mapStateToProps = state => {
  return {
    time: state.time,
    apiKeys: state.apiKeys,
    offers: state.offers,
    contracts: state.contracts,
    userId: state.auth.profile._id,
    exchanges: state.exchanges
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
      dispatch(updateExchagnes());
    },
    onOfferPay: offer => dispatch(payOffer(offer)),
    onOfferAccepted: offer => dispatch(acceptOffer(offer)),
    onOfferRejected: offer => dispatch(rejectOffer(offer)),
    onOfferCanceled: offer => dispatch(cancelOffer(offer)),
    onContractRate: (feedback, userId, time) => dispatch(rateContract(feedback)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
