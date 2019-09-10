import React from 'react';
import { Row, Container } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import { transferTokenAmounts } from '../../actions/payments';
import InputField from '../../components/InputField';

class Payments extends React.PureComponent {
  state = {
    destination: '',
    amount: '',
  };

  handleChange = (event) => {
    const id = event.target.id;
    const value = event.target.value;

    this.setState({ [id]: value });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const { transferTokenAmounts } = this.props;
    const { destination, amount } = this.state;

    if (destination === '' || amount === '') { alert('Can\'t be blank'); }

    transferTokenAmounts(destination, amount);
  };

  render = () => {
    return (
      <Container>
        <form onSubmit={this.handleSubmit}>
          <Row className="justify-content-center">
            <InputField
              id="destination"
              type="text"
              label={{ id: 'payments.destination' }}
              value={this.state.destination}
              placeholder={{ id: 'placeholders.destination' }}
              onChange={this.handleChange}
            />
          </Row>
          <Row className="justify-content-center">
            <InputField
              id="amount"
              type="number"
              label={{ id: 'payments.amount' }}
              value={this.state.amount}
              placeholder={{ id: 'placeholders.amount' }}
              onChange={this.handleChange}
            />
          </Row>
          <Row className="justify-content-center">
            <button
              className="edit-btn btn btn-secondary"
              style={{ marginBottom: '15px' }}
              type="submit"
            >
              <FormattedMessage id="shared.send" />
            </button>
          </Row>
        </form>
      </Container>
    );
  };
};

const mapDispatchToProps = {
  transferTokenAmounts,
};

export default connect(null, mapDispatchToProps)(Payments);

