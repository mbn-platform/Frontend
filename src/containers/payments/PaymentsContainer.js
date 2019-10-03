import { connect } from 'react-redux';

import { getMbnAddress, createMbnAddress } from '../../actions/payments';
import { fetchTariffs, paymentRequest, mbnTransfer } from '../../actions/tariffs';
import Payments from './Payments';

const mapStateToProps = ({ tariffs, payments: { address } }) => ({
  tariffs,
  address,
});

const mapDispatchToProps = {
  getMbnAddress,
  createMbnAddress,
  fetchTariffs,
  paymentRequest,
  mbnTransfer,
};

export default connect(mapStateToProps, mapDispatchToProps)(Payments);
