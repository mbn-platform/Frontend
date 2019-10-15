import { connect } from 'react-redux';

import { fetchTariffs, createPaymentRequest } from '../../actions/tariffs';
import Tariffs from './Tariffs';

const mapStateToProps = ({ auth, tariffs, payments: { paymentRequest }}) => {
  let billing;
  const loggedIn = auth.loggedIn;

  if (loggedIn) {
    billing = auth.profile.billing;
  }

  return {
    loggedIn,
    billing,
    tariffs,
    paymentRequest,
  };
};

const mapDispatchToProps = {
  fetchTariffs,
  createPaymentRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(Tariffs);
