import { connect } from 'react-redux';

import { fetchTariffs, createPaymentRequest } from 'actions/tariffs';
import Tariffs from './Tariffs';
import { tariffsSelector } from 'selectors/tariffs';
import { loggedInSelector, billingSelector } from 'selectors/auth';
import { paymentRequestSelector } from 'selectors/payments';

const mapStateToProps = (state) => ({
  tariffs: tariffsSelector(state),
  loggedIn: loggedInSelector(state),
  paymentRequest: paymentRequestSelector(state),
  billing: billingSelector(state),
});

const mapDispatchToProps = {
  fetchTariffs,
  createPaymentRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(Tariffs);
