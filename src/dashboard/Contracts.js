import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import SegmentedControl from '../generic/SegmentedControl';
import ReactTable from '../generic/SelectableReactTable';
import SearchHeaderWithoutSort from '../generic/SearchHeaderWithoutSort';
import { Desktop, Mobile } from '../generic/MediaQuery';
import Pagination from '../generic/Pagination';
import { UncontrolledTooltip } from 'reactstrap';
import { CONTRACT_STATE_FINISHED, CONTRACT_STATE_VERIFIED, CONTRACT_STATE_HALTED } from '../constants';



class Contracts extends React.Component {

  constructor(props) {
    super(props);
    this.state = {ownedTabIndex: 0, completedTabIndex: 0};
    this.onOwnershipTabChange = this.onOwnershipTabChange.bind(this);
    this.onStatusTabChange = this.onStatusTabChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if(!nextProps.selectedContract) {
      return;
    }
    if(this.props.selectedContract && this.props.selectedContract._id === nextProps.selectedContract._id) {
      return;
    }
    if(nextProps.selectedContract !== this.props.selectedContract) {
      let requiredTab;
      if(nextProps.selectedContract.state === CONTRACT_STATE_FINISHED || nextProps.selectedContract.state === CONTRACT_STATE_HALTED) {
        requiredTab = 1;
      } else {
        requiredTab = 0;
      }
      if(this.state.completedTabIndex !== requiredTab) {
        this.setState({completedTabIndex: requiredTab});
      }
    }
  }

  onOwnershipTabChange(index) {
    this.setState({ownedTabIndex: index});
  }
  onStatusTabChange(index) {
    this.setState({completedTabIndex: index});
  }

  renderContent() {
    const data = this.state.completedTabIndex ?
      this.props.contracts.finished :
      this.props.contracts.current;
    return (
      <div>
        <Desktop>
          <ReactTable
            style={{'height': 345}}
            columns={this.getTableColumns()}
            data={data}
            selectedItem={this.props.selectedContract}
            onItemSelected={this.props.onContractSelected}
            scrollBarHeight={257}
          />
        </Desktop>
        <Mobile>
          <ReactTable
            columns={this.getTableMobileColumns()}
            data={data}
            selectedItem={this.props.selectedContract}
            onItemSelected={this.props.onContractSelected}
            minRows={5}
            showPagination={true}
            defaultPageSize={5}
            PaginationComponent={Pagination}
          />
        </Mobile>
      </div>
    );
  }
  render() {
    return (
      <div className="table contracts_table">
        <div className="table_title_wrapper clearfix">
          <div className="table_title">Contracts</div>
          <SegmentedControl selectedIndex={this.state.completedTabIndex} segments={['CURRENT', 'FINISHED']} onChange={this.onStatusTabChange}/>
        </div>
        {this.renderContent()}
      </div>
    );
  }

  getExpireDateColumn() {
    const header = this.state.completedTabIndex ? 'Finished at' : 'Expire date';
    return {
      Header: ContractTableHeader(header),
      id: 'date',
      accessor: 'start',
      Cell: row => {
        let date;
        if(row.original.state === CONTRACT_STATE_VERIFIED) {
          date = row.value * 1000 + row.original.duration * 86400000;
        } else {
          date = row.original.finishDate;
        }
        return formatDate(new Date(date));
      },
      minWidth: 60,
      className: 'table_col_value',
      headerClassName: 'expire_date',
    };
  }

  getTableColumns() {
    return [{
      id: 'contractor',
      Header: SearchHeaderWithoutSort('Contractor', '', () => {}),
      headerClassName: 'contractor',
      className: 'table_col_value',
      accessor: c => c.toUser[0].name,
      minWidth: 70,
      Cell: row => (<div className="contractor_link">@<Link className="table_col_value_a" to={'/' + row.value}>{row.value}</Link></div>),
    }, this.getExpireDateColumn(), {
      Header: ContractTableHeader('Current\nprofit, %'),
      id: 'currentProfit',
      className: 'table_col_value',
      headerClassName: 'current_profit',
      accessor: c => {
        let balance;
        switch(c.state) {
          case CONTRACT_STATE_VERIFIED:
            balance = c.balance;
            if(balance === null) {
              return null;
            }
            break;
          case CONTRACT_STATE_HALTED:
          case CONTRACT_STATE_FINISHED:
            balance = c.finishBalance / 100000000;
            break;
          default:
            console.log('invalid contract state');
        }
        const percent = ((balance / (c.startBalance / 100000000) || 0) * 100 - 100).toFixed(2);
        return percent;
      },
      minWidth: 50,
      Cell: NegativeValuesCell,
      sortMethod: (a,b, desc) => {
        return parseFloat(a) - parseFloat(b);
      }
    }, {
      Header: ContractTableHeader('Max\nloss, %'),
      className: 'table_col_value',
      headerClassName: 'max_loss',
      minWidth: 50,
      accessor: 'maxLoss',
    }, {
      id: 'startBalance',
      className: 'table_col_value',
      headerClassName: 'start_balance',
      Header: ContractTableHeader('Start\nbalance'),
      minWidth: 50,
      accessor: c => formatBalance(c.startBalance / 100000000, c.currency) + ' ' + c.currency,
      sortMethod: (a,b, desc) => {
        return parseFloat(a) - parseFloat(b);
      }
    }, {
      id: 'currentBalance',
      headerClassName: 'current_balance',
      className: 'table_col_value',
      Header: ContractTableHeader('Current\nbalance'),
      minWidth: 50,
      accessor: c => {
        let balance;
        switch(c.state) {
          case CONTRACT_STATE_VERIFIED:
            balance = c.balance;
            if(balance === null) {
              return null;
            }
            break;
          case CONTRACT_STATE_HALTED:
          case CONTRACT_STATE_FINISHED:
            balance = c.finishBalance / 100000000;
            break;
          default:
            console.log('invalid contract state');
        }
        return formatBalance(balance, c.currency) + ' ' + c.currency;
      },
      sortMethod: (a,b, desc) => {
        return parseFloat(a) - parseFloat(b);
      }
    }, {
      id: 'left',
      Header: ContractTableHeader('Target\nbalance'),
      headerClassName: 'left_column',
      className: 'table_col_value',
      minWidth: 40,
      accessor: c => formatBalance(c.targetBalance / 100000000, c.currency) + ' ' + c.currency,
      sortMethod: (a,b, desc) => {
        return parseFloat(a) - parseFloat(b);
      }
    }, {
      Header: ContractTableHeader('Fee, %'),
      minWidth: 30,
      headerClassName: 'fee_column',
      className: 'table_col_value',
      accessor: 'fee'
    }, {
      Header: <TXHeader />,
      Cell: TXCell(this.props.selectedNet),
      minWidth: 30,
      sortable: false,
      accessor: 'tx',
      headerClassName: 'tx_column',
      className: 'tx_column'
    }, {
      Header: HelpHeader('Status'),
      accessor: 'state',
      minWidth: 50,
      Cell: StatusCell,
      headerClassName: 'status_column'
    }];
  }

  getTableMobileColumns() {
    return [{
      id: 'contractor',
      Header: SearchHeaderWithoutSort('Contractor', '', () => {}),
      headerClassName: 'contractor',
      className: 'table_col_value',
      accessor: c => c.toUser[0].name,
      minWidth: 84,
      Cell: row => (<div className="contractor_link">@<Link className="table_col_value_a" to={'/' + row.value}>{row.value}</Link></div>),
    }, {
      id: 'currentBalance',
      headerClassName: 'current_balance',
      className: 'table_col_value',
      minWidth: 82,
      Header: ContractTableHeader('Current\nbalance'),
      accessor: c => {
        const currentBalance = c.balance;
        return formatBalance(currentBalance, c.currency) + ' ' + c.currency;
      },
      sortMethod: (a,b, desc) => {
        return parseFloat(a) - parseFloat(b);
      }
    }, {
      Header: ContractTableHeader('Fee, %'),
      headerClassName: 'fee_column',
      className: 'table_col_value',
      minWidth: 63,
      accessor: 'fee'
    }, {
      Header: HelpHeader('Status'),
      accessor: 'state',
      Cell: StatusCell,
      minWidth: 44,
      headerClassName: 'status_column'
    }, {
      Header: <TXHeader />,
      Cell: TXCell(this.props.selectedNet),
      accessor: 'tx',
      sortable: false,
      minWidth: 45,
      headerClassName: 'tx_column',
      className: 'tx_column'
    }];

  }
}

const HelpHeader = header => {
  return (
    <div className="table_header_wrapper contract_header_wrapper">
      <div className="table_header">{header}</div>
      <ContractStatusHelp />
      <div className="sort_icon_wrapper">
        <div className="green_arrow"></div>
      </div>
    </div>
  );
};

const ContractStatusHelp = () => (
  <div id="help-icon-contract-status" className="table_header_help_wrapper" style={{paddingTop: 22}}>
    <UncontrolledTooltip target="help-icon-contract-status" placement="auto-start">
      <div className="status_desc_item">
        <div className="status_desc_item_cyrcle green"></div>
        <div className="status_desc_item_text">completed</div>
      </div>
      <div className="status_desc_item">
        <div className="status_desc_item_cyrcle yellow"></div>
        <div className="status_desc_item_text">in progress</div>
      </div>
      <div className="status_desc_item">
        <div className="status_desc_item_cyrcle red"></div>
        <div className="status_desc_item_text">failed</div>
      </div>
    </UncontrolledTooltip>
  </div>
);

const TXHeader = () => (
  <div className="table_header_wrapper contract_header_wrapper">
    <div className="table_header">TX</div>
    <div id="help-icon-tx" className="table_header_help_wrapper" style={{paddingTop: 22}}/>
    <UncontrolledTooltip target="help-icon-tx">
      This is a link on etherscan.io which contains all details of your contract
    </UncontrolledTooltip>
  </div>
);

const ContractTableHeader = header => (
  <div className="table_header_wrapper contract_header_wrapper">
    <div className="table_header">{header}</div>
    <div className="sort_icon_wrapper">
      <div className="green_arrow"></div>
    </div>
  </div>
);
const NegativeValuesCell = row => (
  <div className={parseFloat(row.value) < 0 ? 'table_value_red' : 'table_value_green'}>{row.value}</div>
);

const TXCell = selectedNet => ({value}) => (
  <a className="tx_link" target="_blank" href={etherscanLink(selectedNet, value)} />
);

function etherscanLink(net, tx) {
  let url;
  switch(net) {
    case 'mainnet':
      url = 'https://etherscan.io/tx/';
      break;
    case 'testnet':
      url = 'https://ropsten.etherscan.io/tx/';
      break;
  }
  return url + tx;
}

const StatusCell = ({value, original}) => {
  let colorClassName;
  switch(value) {
    case CONTRACT_STATE_FINISHED:
      switch(original.reason) {
        case 'targetBalance':
          colorClassName = 'green';
          break;
        default:
          colorClassName = 'red';
      }
      break;
    case CONTRACT_STATE_VERIFIED:
      colorClassName = 'yellow';
      break;
    case CONTRACT_STATE_HALTED:
      colorClassName = 'red';
      break;
    default:
      break;
  }
  return (
    <div className={classNames('status_circle', colorClassName)}></div>
  );
};

export default Contracts;

function formatDate(date) {
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  if(month < 10) {
    month = '0' + month;
  }
  let day = date.getDate();
  if(day < 10) {
    day = '0' + day;
  }
  return day + '.' + month + '.' + year;
}
function formatBalance(value, name) {
  if(name === 'USDT') {
    return (value || 0).toFixed(2);
  } else {
    return (value || 0).toFixed(8);
  }
}
