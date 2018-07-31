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
import { calculateTotalBalance } from '../generic/util';
import { Row, Container, Col } from 'reactstrap';



class Contracts extends React.Component {

  static TAB_CURRENT = 0
  static TAB_FINISHED = 1

  constructor(props) {
    super(props);
    this.state = {
      selectedTab: Contracts.TAB_CURRENT,
      selectedApiKeyId: null,
      filtered: [{id: 'contractor', value: ''}],
    };
    this.onTabClick = this.onTabClick.bind(this);
  }


  static getDerivedStateFromProps(props, state) {
    if(props.selectedApiKey && props.selectedApiKey._id !== state.selectedApiKeyId) {
      return {selectedApiKeyId: props.selectedApiKey._id, selectedTab: Contracts.TAB_CURRENT};
    } else if(!props.selectedApiKey) {
      return {selectedApiKeyId: null};
    }
    return null;
  }

  onTabClick(index) {
    this.setState({selectedTab: index});
  }

  renderContent() {
    let data;
    switch(this.state.selectedTab) {
      case Contracts.TAB_CURRENT:
        data = this.props.contracts.current;
        if(this.props.selectedApiKey) {
          data = data.filter(c => c.keyId === this.props.selectedApiKey._id);
        }
        break;
      case Contracts.TAB_FINISHED:
        data = this.props.contracts.finished;
        break;
      default:
        break;
    }
    return (
      <div>
        <Desktop>
          <ReactTable
            style={{'height': 345}}
            columns={this.getTableColumns()}
            data={data}
            filtered={this.state.filtered}
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
            filtered={this.state.filtered}
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
        <Container fluid>
          <Row className="table_title_wrapper">
            <Col xs="12" sm="6" className="table_title">Contracts
              <span className="contracts-showall-button text-muted" onClick={() => {
                this.setState({selectedTab: Contracts.TAB_CURRENT});
                this.props.onShowAllClicked();
              }}>Show all</span>
            </Col>
            <Col sm="6">
              <SegmentedControl selectedIndex={this.state.selectedTab} segments={['CURRENT', 'FINISHED']} onChange={this.onTabClick}/>
            </Col>
          </Row>
        </Container>
        {this.renderContent()}
      </div>
    );
  }

  getExpireDateColumn() {
    const header = this.state.completedTabIndex ? 'Finished at' : 'Expire date';
    return {
      Header: ContractTableHeader(header),
      id: 'date',
      accessor: c => {
        if(c.state === CONTRACT_STATE_FINISHED) {
          const date = c.finishDt ? new Date(c.finishDt) : new Date();
          return date;
        } else {
          const date = new Date(c.dt);
          date.setDate(date.getDate() + c.contractSettings.duration);
          return date;
        }
      },
      Cell: row => {
        return formatDate(row.value);
      },
      minWidth: 80,
      className: 'table_col_value',
      headerClassName: 'expire_date',
    };
  }

  onFilter = e => {
    const value = e.target.value;
    this.setState(state => {
      const filtered = state.filtered.map(i => i.id === 'contractor' ? {id: 'contractor', value} : i);
      return {filtered};
    });
  }

  getTableColumns() {
    const nameFilter = this.state.filtered.find(f => f.id === 'contractor').value;
    return [{
      id: 'contractor',
      Header: SearchHeaderWithoutSort('Contractor', nameFilter, this.onFilter),
      headerClassName: 'contractor',
      className: 'table_col_value',
      accessor: c => c.to.name,
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
            balance = (c.totalInBTC || 0) / 100000000;
            break;
          case CONTRACT_STATE_HALTED:
          case CONTRACT_STATE_FINISHED:
            balance = c.finishBalance / 100000000;
            break;
          default:
            console.log('invalid contract state');
        }
        const percent = ((balance / c.contractSettings.sum - 1) * 100).toFixed(2);
        return percent;
      },
      minWidth: 55,
      Cell: NegativeValuesCell,
      sortMethod: (a,b, desc) => {
        return parseFloat(a) - parseFloat(b);
      }
    }, {
      Header: ContractTableHeader('Max\nloss, %'),
      className: 'table_col_value',
      headerClassName: 'max_loss',
      minWidth: 55,
      accessor: 'contractSettings.maxLoss',
    }, {
      id: 'startBalance',
      className: 'table_col_value',
      headerClassName: 'start_balance',
      Header: ContractTableHeader('Start\nbalance'),
      minWidth: 110,
      accessor: c => `${c.contractSettings.sum} ${c.contractSettings.currency}`,
      sortMethod: (a,b, desc) => {
        return parseFloat(a) - parseFloat(b);
      }
    }, {
      id: 'currentBalance',
      headerClassName: 'current_balance',
      className: 'table_col_value',
      Header: ContractTableHeader('Current\nbalance'),
      minWidth: 110,
      accessor: c => {
        let balance;
        switch(c.state) {
          case CONTRACT_STATE_VERIFIED:
            balance = (c.totalInBTC || 0) / 100000000;
            break;
          case CONTRACT_STATE_HALTED:
          case CONTRACT_STATE_FINISHED:
            balance = c.finishBalance / 100000000;
            break;
          default:
            console.log('invalid contract state');
        }
        return formatBalance(balance, c.contractSettings.currency) + ' ' + c.contractSettings.currency;
      },
      sortMethod: (a,b, desc) => {
        return parseFloat(a) - parseFloat(b);
      }
    }, {
      id: 'left',
      Header: ContractTableHeader('Target\nbalance'),
      headerClassName: 'left_column',
      className: 'table_col_value',
      minWidth: 110,
      accessor: c => `${formatBalance(c.contractSettings.sum * (c.contractSettings.roi / 100 + 1), c.contractSettings.currency)} ${c.contractSettings.currency}`,
      sortMethod: (a,b, desc) => {
        return parseFloat(a) - parseFloat(b);
      }
    }, {
      Header: ContractTableHeader('Fee, %'),
      minWidth: 50,
      headerClassName: 'fee_column',
      className: 'table_col_value',
      accessor: 'contractSettings.fee'
    }, {
      Header: <TXHeader />,
      Cell: TXCell(this.props.net),
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
      accessor: c => c.to.name,
      minWidth: 84,
      Cell: row => (<div className="contractor_link">@<Link className="table_col_value_a" to={'/' + row.value}>{row.value}</Link></div>),
    }, {
      id: 'currentBalance',
      headerClassName: 'current_balance',
      className: 'table_col_value',
      minWidth: 110,
      Header: ContractTableHeader('Current\nbalance'),
      accessor: c => {
        let balance;
        switch(c.state) {
          case CONTRACT_STATE_VERIFIED:
            balance = (c.totalInBTC || 0) / 100000000;
            break;
          case CONTRACT_STATE_HALTED:
          case CONTRACT_STATE_FINISHED:
            balance = c.finishBalance / 100000000;
            break;
          default:
            console.log('invalid contract state');
        }
        return formatBalance(balance, c.contractSettings.currency) + ' ' + c.contractSettings.currency;
      },
      sortMethod: (a,b, desc) => {
        return parseFloat(a) - parseFloat(b);
      }
    }, {
      Header: ContractTableHeader('Fee, %'),
      headerClassName: 'fee_column',
      className: 'table_col_value',
      minWidth: 63,
      accessor: 'contractSettings.fee'
    }, {
      Header: HelpHeader('Status'),
      accessor: 'state',
      Cell: StatusCell,
      minWidth: 44,
      headerClassName: 'status_column'
    }, {
      Header: <TXHeader />,
      Cell: TXCell(this.props.net),
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

const TXCell = net => ({value}) => (
  <a className="tx_link" target="_blank" href={etherscanLink(net, value)} />
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
      switch(original.finishReason) {
        case 'TARGET_PROFIT':
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
