import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import {
  CONTRACT_STATE_FINISHED,
  CONTRACT_STATE_VERIFIED,
  CONTRACT_STATE_HALTED,
} from '../../../constants';
import ReceivedContracts from './ReceivedContracts';
import ReceivedDetails from './ReceivedDetails';
import ProvidedContracts from './ProvidedContracts';
import ProvidedDetails from './ProvidedDetails';
import Groups from './Groups';

const ContractTableHeader = header => (
  <div className="table_header_wrapper contract_header_wrapper">
    <div className="table_header">
      <FormattedMessage {...header} />
    </div>
    <div className="sort_icon_wrapper">
      <div className="green_arrow"/>
    </div>
  </div>
);

const NegativeValuesCell = ({ value }) => (
  <div className={parseFloat(value) < 0 ? 'table_value_red' : 'table_value_green'}>
    {value}
  </div>
);

const formatDate = (date) => {
  const [yyyy, mm, dd] = date.toISOString().substr(0,10).split('-');

  return `${dd}.${mm}.${yyyy}`;
};

const formatBalance = (value = 0, name) => (
  name === 'USDT' ? value.toFixed(2) : value.toFixed(8)
);

class Contracts extends React.Component {
  static propTypes = {
    userName: PropTypes.string.isRequired,
    contracts: PropTypes.arrayOf(PropTypes.shape()),
    assetGroups: PropTypes.arrayOf(PropTypes.shape()),
    selectedReceivedContract: PropTypes.shape(),
    selectedProvidedContract: PropTypes.shape(),
    onContractSelected: PropTypes.func.isRequired,
  };

  static defaultProps = {
    contracts: [],
    assetGroups: [],
    selectedReceivedContract: null,
    selectedProvidedContract: null,
  };

  render() {
    const {
      contracts, userName, selectedReceivedContract,
      assetGroups, selectedProvidedContract, onContractSelected,
    } = this.props;
    const receivedContracts = contracts.current.filter(({ to }) => to.name === userName);
    const providedContracts = contracts.current.filter(({ to }) => to.name !== userName);

    return (
      <div className="contracts-block-wrapper">
        <div className="contracts-wrapper">
          <ReceivedContracts
            contracts={receivedContracts}
            getColumns={this.getTableColumns}
            selectedItem={selectedReceivedContract}
            onItemSelected={onContractSelected}
          />
          <div className="balances-groups-wrapper">
            <ReceivedDetails
              contract={selectedReceivedContract}
            />
            <Groups
              assetGroups={assetGroups}
              selectedContract={selectedReceivedContract}
            />
          </div>
        </div>
        <div className="contracts-wrapper">
          <ProvidedContracts
            contracts={providedContracts}
            getColumns={this.getTableColumns}
            selectedItem={selectedProvidedContract}
            onItemSelected={onContractSelected}
          />
          <ProvidedDetails
            contract={selectedProvidedContract}
          />
        </div>
      </div>
    );
  }

  getExpireDateColumn() {
    return {
      Header: ContractTableHeader({ id: 'dashboard.expireDate' }),
      id: 'date',
      accessor: ({ dt, contractSettings }) => {
        const date = new Date(dt);
        date.setDate(date.getDate() + contractSettings.duration);

        return date;
      },
      Cell: ({ value }) => formatDate(value),
      minWidth: 80,
      className: 'table_col_value',
      headerClassName: 'expire_date',
    };
  }

  getTableColumns() {
    return [
      {
        id: 'contractor',
        Header: ContractTableHeader({ id: 'dashboard.contractor' }),
        headerClassName: 'contractor',
        className: 'table_col_value',
        accessor: ({ to: { name } }) => name,
        minWidth: 70,
        Cell: ({ value }) => (
          <div className="contractor_link">
            @<Link className="table_col_value_a" to={'/' + value}>
              {value}
            </Link>
          </div>
        ),
      },
      {
        Header: ContractTableHeader({ id: 'dashboard.expireDate' }),
        id: 'date',
        accessor: ({ dt, contractSettings }) => {
          const date = new Date(dt);
          date.setDate(date.getDate() + contractSettings.duration);

          return date;
        },
        Cell: ({ value }) => formatDate(value),
        minWidth: 80,
        className: 'table_col_value',
        headerClassName: 'expire_date',
      },
      {
        Header: ContractTableHeader({ id: 'dashboard.currentProfitPercent' }),
        id: 'currentProfit',
        className: 'table_col_value',
        headerClassName: 'current_profit',
        accessor: ({ state, totalInBTC, finishBalance, contractSettings }) => {
          let balance;
          switch(state) {
            case CONTRACT_STATE_VERIFIED:
              balance = (totalInBTC || 0) / 100000000;
              break;
            case CONTRACT_STATE_HALTED:
            case CONTRACT_STATE_FINISHED:
              balance = finishBalance / 100000000;
              break;
            default:
              console.log('invalid contract state');
          }
          const percent = ((balance / contractSettings.sum - 1) * 100).toFixed(2);

          return percent;
        },
        minWidth: 55,
        Cell: NegativeValuesCell,
        sortMethod: (a,b) => parseFloat(a) - parseFloat(b),
      },
      {
        Header: ContractTableHeader({ id: 'dashboard.maxLossPercent' }),
        className: 'table_col_value',
        headerClassName: 'max_loss',
        minWidth: 55,
        accessor: 'contractSettings.maxLoss',
      },
      {
        id: 'startBalance',
        className: 'table_col_value',
        headerClassName: 'start_balance',
        Header: ContractTableHeader({ id: 'dashboard.startBalance' }),
        minWidth: 110,
        accessor: ({ contractSettings }) => `${contractSettings.sum} ${contractSettings.currency}`,
        sortMethod: (a,b) => parseFloat(a) - parseFloat(b),
      },
      {
        id: 'currentBalance',
        headerClassName: 'current_balance',
        className: 'table_col_value',
        Header: ContractTableHeader({ id: 'dashboard.currentBalance' }),
        minWidth: 110,
        accessor: ({ state, totalInBTC, finishBalance, contractSettings }) => {
          let balance;
          switch(state) {
            case CONTRACT_STATE_VERIFIED:
              balance = (totalInBTC || 0) / 100000000;
              break;
            case CONTRACT_STATE_HALTED:
            case CONTRACT_STATE_FINISHED:
              balance = finishBalance / 100000000;
              break;
            default:
              console.log('invalid contract state');
          }

          return `${formatBalance(balance, contractSettings.currency)} ${contractSettings.currency}`;
        },
        sortMethod: (a,b) => parseFloat(a) - parseFloat(b),
      },
      {
        id: 'left',
        Header: ContractTableHeader({ id: 'dashboard.targetBalance' }),
        headerClassName: 'left_column',
        className: 'table_col_value',
        minWidth: 110,
        accessor: ({ contractSettings }) => (
          `${formatBalance(contractSettings.sum * (contractSettings.roi / 100 + 1), contractSettings.currency)} ${contractSettings.currency}`
        ),
        sortMethod: (a,b) => parseFloat(a) - parseFloat(b),
      },
      {
        Header: ContractTableHeader({ id: 'dashboard.feePercent' }),
        minWidth: 50,
        headerClassName: 'fee_column',
        className: 'table_col_value',
        accessor: 'contractSettings.fee',
      },
    ];
  }

  getTableMobileColumns() {
    return [
      {
        id: 'contractor',
        Header: ContractTableHeader({ id: 'dashboard.contractor' }),
        headerClassName: 'contractor',
        className: 'table_col_value',
        accessor: ({ to: { name } }) => name,
        minWidth: 84,
        Cell: ({ value }) => (
          <div className="contractor_link">
            @<Link className="table_col_value_a" to={'/' + value}>
              {value}
            </Link>
          </div>
        ),
      },
      {
        id: 'currentBalance',
        headerClassName: 'current_balance',
        className: 'table_col_value',
        minWidth: 110,
        Header: ContractTableHeader({ id: 'dashboard.currentBalance' }),
        accessor: ({ state, totalInBTC, finishBalance, contractSettings }) => {
          let balance;
          switch(state) {
            case CONTRACT_STATE_VERIFIED:
              balance = (totalInBTC || 0) / 100000000;
              break;
            case CONTRACT_STATE_HALTED:
            case CONTRACT_STATE_FINISHED:
              balance = finishBalance / 100000000;
              break;
            default:
              console.log('invalid contract state');
          }

          return `${formatBalance(balance, contractSettings.currency)} ${contractSettings.currency}`;
        },
        sortMethod: (a,b) => parseFloat(a) - parseFloat(b),
      },
      {
        Header: ContractTableHeader({ id: 'dashboard.feePercent' }),
        headerClassName: 'fee_column',
        className: 'table_col_value',
        minWidth: 63,
        accessor: 'contractSettings.fee',
      },
    ];
  };
}

const mapStateToProps = ({ auth, assetGroups }) => ({
  userName: auth.profile.name,
  assetGroups,
});

export default connect(mapStateToProps)(Contracts);
