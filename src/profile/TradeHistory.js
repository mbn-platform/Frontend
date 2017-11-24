import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import { Desktop, Mobile } from '../generic/MediaQuery';
import Pagination from '../generic/Pagination';
import ReactTable from '../generic/SelectableReactTable';
import { formatDate } from '../generic/util';

class TradeHistory extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Col xs="12" sm="12" md="12" lg="12" xl="7" className="trade-block">
        <Container fluid className="h-100">
          <Row className="h-100">
            <Col className="trade-history">
              <div className="card">
                <div className="card-header">
                  <div className="container-fuild h-100">
                    <div className="row h-100 align-items-center">
                      <div className="col-auto title-text">
                        <span className="icon icon-profit icon-history-clock-button"></span>TRADE HISTORY
                      </div>
                      <div className="col">
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  {this.renderTable()}
                </div>

              </div>
            </Col>
          </Row>
        </Container>
      </Col>
    );
  }

  getColumns() {
    return [
      {
        id: 'date',
        Header: SortableHeader('Date'),
        accessor: trade => formatDate(new Date(trade.date)),
        minWidth: 50,
        className: 'table_col_value',

      },
      {
        Header: SortableHeader('Type'),
        Cell: TradeTypeCell,
        accessor: 'type',
        minWidth: 50,
        className: 'table_col_value',
      },
      {
        Header: SortableHeader('Price, BTC'),
        accessor: 'price',
        minWidth: 50,
        className: 'table_col_value',
      },
      {
        Header: SortableHeader('Amount'),
        id: 'amount',
        accessor: trade => trade.amountCurrency + ' ' + trade.amount,
        minWidth: 50,
        className: 'table_col_value',
      },
      {
        Header: SortableHeader('Total, BTC'),
        accessor: 'total',
        minWidth: 50,
        className: 'table_col_value',
      },
      {
        Header: SortableHeader('TX', false),
        accessor: 'tx',
        sortable: false,
        minWidth: 30,
        className: 'table_col_value',
        Cell: rowInfo => (<a className="tx_link" target="_blank" href={rowInfo.value || '/'} />),
      },
    ];
  }
  renderTable() {
    const data = this.props.trades.reduce((accum, value) => accum.concat(value), []);
    return (
      <div>
        <Desktop>
          <div  className="profile_table_wrapper">
            <ReactTable
              data={data}
              className="profile_table"
              onItemSelected={() => {}}
              columns={this.getColumns()}
              scrollBarHeightAuto='true'
            />
          </div>
        </Desktop>
        <Mobile>
          <div>
            <ReactTable
              data={data}
              onItemSelected={() => {}}
              columns={this.getColumns()}
              minRows={5}
              showPagination={true}
              defaultPageSize={5}
              PaginationComponent={Pagination}
            />
          </div>
        </Mobile>
      </div>
    );

  }
}

const SortableHeader = (header, showSort = true) => (
  <div className="table_header_wrapper contract_header_wrapper">
    <span className="table_header">{header}</span>
    {showSort ? (
      <div className="sort_icon_wrapper" style={{display: 'block', margin: 0}}>
        <div className="green_arrow green_arrow_bottom" ></div>
      </div>
    ) : null}
  </div>
);

const TradeTypeCell = row => {
  const className = row.original.type === 'Buy' ? 'green' : 'red';
  return (<div className={className}>{row.original.type}</div>);
};

export default TradeHistory;
