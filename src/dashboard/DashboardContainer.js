import Dashboard from './Dashboard';
import { connect } from 'react-redux';
import { deleteApiKey } from '../actions/apiKeys';
import { acceptOffer, cancelOffer, rejectOffer } from '../actions/offers';
import { fetchDashboardData } from '../actions/dashboard';

const mapStateToProps = state => {
  return {
    apiKeys: state.apiKeys,
    offers: state.offers,
    currentContracts: state.currentContracts
  };
};


const mapDispatchToProps = dispatch => {
  return {
    onKeyDeleteClick: apiKey => {
      console.log('on key delete click');
      if(apiKey.inUse) {
        alert('cannot delete key - key is in use');
      } else {
        dispatch(deleteApiKey(apiKey));
      }
    },
    onDashboardMounted: () => dispatch(fetchDashboardData()),
    onOfferAccepted: offer => dispatch(cancelOffer(offer)),
    onOfferRejected: offer => dispatch(rejectOffer(offer)),
    onOfferCanceled: offer => dispatch(acceptOffer(offer))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);

