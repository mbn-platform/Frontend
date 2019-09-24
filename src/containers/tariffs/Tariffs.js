import React from 'react';
import { Col, Button, Row, Container } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import ReactTable from 'react-table';

import Header from './components/Header';

class Tariffs extends React.PureComponent {
  data = [
    { service: 'TRADING', free: "V", premium: "V", pro: 'V' },
    { service: 'API exchange', free: "3", premium: "25", pro: 'NO LIMITS' },
    { service: 'ORDERS: STOP, OCO, NO-LOCK', free: "25", premium: "100", pro: 'NO LIMITS' },
    { service: 'PROOF-OF-TRADE', free: "V", premium: "V", pro: 'V' },
    { service: 'TRUST MANAGEMENT', free: "X", premium: "UP TO $5000", pro: 'NO LIMITS' },
    { service: 'TELEGRAM NOTIFICATIONS', free: "X", premium: "V", pro: 'V' },
    { service: 'STATUS ICON', free: "X", premium: "X", pro: 'V' },
  ];

  render = () => (
    <div class="tariffs__container">
      <ReactTable
        minRows={7}
        data={this.data}
        columns={[
          {
            Header: '',
            columns: [
              {
                Header: "MONTHLY PRICE",
                accessor: "service",
              },
            ]
          },
          {
            Header: <Header label="FREE" />,
            columns: [
              {
                Header: "0",
                accessor: "free",
              },
            ]
          },
          {
            Header: <Header label="PREMIUM" />,
            columns: [
              {
                Header: "1000 MBN ($10)",
                accessor: "premium"
              }
            ]
          },
          {
            Header: <Header label="PRO" />,
            columns: [
              {
                Header: "2500 MBN ($25)",
                accessor: "pro"
              }
            ]
          },

        ]}
        showPagination={false}
      />
      <div className="tariffs__container-description">
        Choose a service plan and click "BUY NOW" button.
        The payment is done from your active ERC-20 wallet or thought a direct transaction.
        Choose what is more convenient for you. The service plan fee is paid in MBN tokens,
        based on the market price available at coinmarketcap. After payment, the service plan is activated for 20 days.
      </div>
      <div className="tariffs__container-button">
        <button onClick={() => {}} type="button" className="btn btn-secondary active">
          <FormattedMessage id="tariffs.buyNow" />
        </button>
      </div>
    </div>
  );
}

export default Tariffs;
