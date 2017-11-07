import React from 'react';
import { Link } from 'react-router-dom';
import SegmentedControl from '../generic/SegmentedControl';
import ReactTable from '../generic/SelectableReactTable';
import SearchHeader from '../generic/SearchHeader';
import HeaderWithHelp from '../generic/HeaderWithHelp';
import { Desktop, Mobile } from '../generic/MediaQuery';
import Pagination from '../generic/Pagination';
import './Contracts.css';



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
    if(nextProps.selectedContract !== this.props.selectedContract) {
      const requiredTab = (nextProps.selectedContract.status === 'completed' & 1);
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
    const data = this.props.contracts.filter(c => {
      const isCompleted = c.status !== 'completed';
      return this.state.completedTabIndex === 0 ? isCompleted : !isCompleted;
    });

    return (
      <div>
        <Desktop>            
          <ReactTable
            style={{'height': 352}}
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
  mobileWidth() {
    return window.outerWidth < 1028;
  }
  render() {
    return (
      <div className="table contracts_table">
        <div className="table_title_wrapper clearfix">
          <div className="table_title">Contracts</div>
          <SegmentedControl selectedIndex={this.state.completedTabIndex} segments={['CURRENT', 'FINISHED']} onChange={this.onStatusTabChange}/>
          <SegmentedControl selectedIndex={this.state.ownedTabIndex} segments={['MINE', 'OTHER']} onChange={this.onOwnershipTabChange}/>
        </div>
        {this.renderContent()}
      </div>
    );
  }

  getTableColumns() {
    return [{
      Header: SearchHeader('Contractor', '', () => {}),
      headerClassName: 'contractor big_column',
      className: 'big_column table_col_value',
      accessor: 'contractor',
      Cell: row => (<div className="contractor_link">@<Link className="table_col_value_a" to={'/' + row.value}>{row.value}</Link></div>),
    }, {
      Header: ContractTableHeader('Expire date'),
      headerClassName: 'expire_date big_column',
      className: 'table_col_value big_column',

    }, {
      Header: ContractTableHeader('Current\nprofit, %'),
      className: 'table_col_value',
      headerClassName: 'current_profit',
      accessor: 'currentProfit',
      Cell: NegativeValuesCell
    }, {
      Header: ContractTableHeader('Max\nloss, %'),
      className: 'table_col_value',
      headerClassName: 'max_loss',
      accessor: 'maxLoss',
    }, {
      id: 'startBalance',
      className: 'table_col_value',
      headerClassName: 'start_balance',
      Header: ContractTableHeader('Start\nbalance, %'),
      accessor: c => c.startBalance + ' ' + c.currency,
    }, {
      id: 'currentBalance',
      headerClassName: 'current_balance small_column',
      className: 'table_col_value small_column',
      Header: ContractTableHeader('Current\nbalance, %'),
      accessor: c => c.currentBalance + ' ' + c.currency,
    }, {
      id: 'left',
      Header: ContractTableHeader('Left'),
      headerClassName: 'left_column small_column',
      className: 'table_col_value',
      accessor: c => c.left + ' ' + c.currency,
    }, {
      Header: ContractTableHeader('Fee, %'),
      headerClassName: 'fee_column small_column',
      className: 'table_col_value small_column',
      accessor: 'fee'
    }, {
      Header: <TXHeader />,
      Cell: TXCell,
      sortable: false,
      headerClassName: 'tx_column small_column',
      className: 'small_column tx_column'
    }, {
      Header: HelpHeader('Status'),
      accessor: 'status',
      Cell: StatusCell,
      headerClassName: 'status_column small_column',
      className: 'small_column'
    }];
  }

  getTableMobileColumns() {
    return [{
      Header: SearchHeader('Contractor', '', () => {}),
      headerClassName: 'contractor big_column',
      className: 'big_column table_col_value',
      accessor: 'contractor',
      minWidth: 84,
      Cell: row => (<div className="contractor_link">@<Link className="table_col_value_a" to={'/' + row.value}>{row.value}</Link></div>),
    }, {
      id: 'currentBalance',
      headerClassName: 'current_balance small_column',
      className: 'table_col_value small_column',
      minWidth: 82,
      Header: ContractTableHeader('Current\nbalance, %'),
      accessor: c => c.currentBalance + ' ' + c.currency,
    }, {
      Header: ContractTableHeader('Fee, %'),
      headerClassName: 'fee_column small_column',
      className: 'table_col_value small_column',
      minWidth: 63,
      accessor: 'fee'
    }, {
      Header: HelpHeader('Status'),
      accessor: 'status',
      Cell: StatusCell,
      minWidth: 44,
      headerClassName: 'status_column small_column',
      className: 'small_column'
    }, {
      Header: <TXHeader />,
      Cell: TXCell,
      sortable: false,
      minWidth: 45,
      headerClassName: 'tx_column small_column',
      className: 'small_column tx_column'
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
  <div className="table_header_help_wrapper" style={{paddingTop: 22}}>
    <div className="table_header_help_text">
      <div className="status_description_wr">
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
      </div>
    </div>
  </div>
);

const TXHeader = () => (
  <div className="table_header_wrapper contract_header_wrapper">
    <div className="table_header">TX</div>
    <div className="table_header_help_wrapper" style={{paddingTop: 22}}>
      <div className="table_header_help_text">This is a link on etherscan.io which contains all details of your contract.</div>
    </div>
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
  <div className={parseFloat(row.value) < 0 ? 'table_value_red' : ''}>{row.value}</div>
);

const TXCell = ({original}) => (
  <Link className="tx_link" to={original.txLink || '/'} />
);

const StatusCell = ({value}) => {
  let className = 'status_circle ';
  switch(value) {
    case 'completed':
      className += 'green';
      break;
    case 'in_progress':
      className += 'yellow';
      break;
    case 'failed':
      className += 'red';
      break;
    default:
      break;
  }
  return (
    <div className={className}></div>
  );
};

export default Contracts;
