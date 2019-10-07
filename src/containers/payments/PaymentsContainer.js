import { connect } from 'react-redux';

import { createPaymentRequest, mbnTransfer } from '../../actions/tariffs';
import Payments from './Payments';

const mapStateToProps = ({ tariffs, payments: { address, paymentRequest } }) => ({
  paymentRequest,
});

const mapDispatchToProps = {
  createPaymentRequest,
  mbnTransfer,
};

export default connect(mapStateToProps, mapDispatchToProps)(Payments);
