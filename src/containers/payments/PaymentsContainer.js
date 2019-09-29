import { connect } from 'react-redux';

import { getMbnAddress, createMbnAddress } from '../../actions/payments';
import { fetchTariffs, paymentRequest } from '../../actions/tariffs';
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
};

export default connect(mapStateToProps, mapDispatchToProps)(Payments);
