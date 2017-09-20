import React from 'react';
import { Link } from 'react-router-dom';
import SegmentedControl from '../generic/SegmentedControl';
import ReactTable from '../generic/SelectableReactTable';
import SearchFilter from '../generic/SearchFilter';
import HeaderWithHelp from '../generic/HeaderWithHelp';
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
      <ReactTable
        style={{height: '352px'}}
        columns={this.getTableColumns()}
        data={data}
        selectedItem={this.props.selectedContract}
        onItemSelected={this.props.onContractSelected}
      />
    );
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
      Header: 'Contractor',
      filterable: true,
      className: 'table_col_value',
      Filter: SearchFilter,
      accessor: 'contractor',
      Cell: row => (<Link className="table_col_value_a" to={'/' + row.value}>{row.value}</Link>),
    }, {
      Header: 'Expire date',
    }, {
      Header: 'Current profit, %',
      className: 'table_col_value',
      accessor: 'currentProfit',
      Cell: NegativeValuesCell
    }, {
      Header: 'Max loss, %',
      className: 'table_col_value',
      accessor: 'maxLoss',
    }, {
      id: 'startBalance',
      className: 'table_col_value',
      Header: 'Start balance',
      accessor: c => c.startBalance + ' ' + c.currency,
    }, {
      id: 'currentBalance',
      className: 'table_col_value',
      Header: 'Current balance',
      accessor: c => c.currentBalance + ' ' + c.currency,
    }, {
      id: 'left',
      Header: 'Left',
      className: 'table_col_value',
      accessor: c => c.left + ' ' + c.currency,
    }, {
      Header: 'Fee, %',
      className: 'table_col_value',
      accessor: 'fee'
    },{
      Header: HeaderWithHelp('TX'),
      Cell: TXCell
    }, {
      Header: HeaderWithHelp('Status'),
      accessor: 'status',
      Cell: StatusCell
    }];

  }
}

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
