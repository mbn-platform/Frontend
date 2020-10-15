import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import ReactTable from '../../components/SelectableReactTable';
import PaginationWithPage from '../../components/PaginationWithPage';
import { Link } from 'react-router-dom';
import { NegativeValuesCell, ContractTableHeader } from './cells';
import { formatBalance, formatDate } from './util';
import {
  fetchActiveContractProvided,
  fetchActiveContractReceived,
} from '../../actions/contracts';

export default class ActiveContracts extends React.Component {
  render() {
    return (
      <Container fluid className="ratings contracts">
        <Row>
          <Col xs="12" sm="12" md="12" lg="12">
            <div className="hashlog__main">
              <div className="hashlog__main-board">
                <ProvidedContractHistory />
                <ReceivedContractHistory className="received" />
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}
class ProvidedContractHistory extends React.Component {

  state = {
    data: [],
    loading: false,
  }

  onFetchData = ({page, pageSize}) => {
    this.setState({loading: true});
    this.fetch(pageSize, page);
  }

  componentDidMount() {
    this.fetch();
  }

  async fetch() {
    try {
      const res = await fetchActiveContractProvided();
      const { items } = res;
      const newState = {data: items, loading: false};
      this.setState(newState);
    } catch (error) {
      console.error(error);
    }
  }

  columns = [
    {
      id: 'to',
      headerClassName: 'hashlog__table-header-title',
      className: 'table_col_value',
      Header: ContractTableHeader('Contractor'),
      sortable: true,
      defaultSortDesc: false,
      accessor: 'to',
      Cell: ({ value }) => (
        <div className="contractor_link">
          @<Link className="table_col_value_a" to={'/' + value}>
            {value}
          </Link>
        </div>
      ),
    },
    {
      headerClassName: 'hashlog__table-header-title',
      className: 'table_col_value',
      Header: ContractTableHeader('Start'),
      accessor: 'start',
      sortable: true,
      defaultSortDesc: true,
      Cell: ({ value }) => formatDate(new Date(value)),
    },
    {
      headerClassName: 'hashlog__table-header-title',
      className: 'table_col_value',
      Header: ContractTableHeader('Finish'),
      accessor: 'finish',
      sortable: true,
      defaultSortDesc: true,
      Cell: ({ value }) => formatDate(new Date(value)),
    },
    {
      headerClassName: 'hashlog__table-header-title',
      className: 'table_col_value',
      id: 'startBalance',
      Header: ContractTableHeader('Start Balance'),
      sortable: true,
      defaultSortDesc: true,
      minWidth: 110,
      Cell: (row) => row.value + ' ' + row.original.currency,
      accessor: 'startBalance',
    },
    {
      className: 'table_col_value',
      headerClassName: 'hashlog__table-header-title',
      Header: ContractTableHeader('Current Balance'),
      id: 'finishBalance',
      sortable: true,
      defaultSortDesc: true,
      minWidth: 120,
      Cell: (row) => formatBalance(row.value, row.original.currency) + ' ' + row.original.currency,
      accessor: 'finishBalance',
    },
    {
      headerClassName: 'hashlog__table-header-title',
      className: 'table_col_value',
      id: 'profit',
      Header: ContractTableHeader('Profit, %'),
      sortable: true,
      defaultSortDesc: true,
      accessor: 'profit',
      Cell: NegativeValuesCell,
    },
    {
      headerClassName: 'hashlog__table-header-title',
      className: 'table_col_value',
      Header: ContractTableHeader('Fee, %'),
      sortable: true,
      defaultSortDesc: true,
      accessor: 'fee',
    },
  ]

  renderTitle() {
    return(<h5>Your Asset Managers</h5>);
  }

  render() {
    const { data, loading } = this.state;
    return (
      <div className={this.props.className}>
        {this.renderTitle()}
        <ReactTable
          data={data}
          columns={this.columns}
          loading={loading}
          defaultPageSize={10}
          showPagination
          PaginationComponent={PaginationWithPage}
        />
      </div>
    );
  }
}

export class ReceivedContractHistory extends ProvidedContractHistory {

  constructor(props) {
    super(props);
    this.columns = this.columns.map((c) => {
      if (c.id === 'to') {
        return {...c, accessor: 'from', id: 'from'};
      } else {
        return c;
      }
    });
  }
  renderTitle() {
    return(<h5>Your Investors</h5>);
  }

  async fetch() {
    try {
      const res = await fetchActiveContractReceived();
      const { items } = res;
      const newState = {data: items, loading: false};
      this.setState(newState);
    } catch (error) {
      console.error(error);
    }
  }

}
