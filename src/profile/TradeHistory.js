import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import { Desktop, Mobile } from '../generic/MediaQuery';
import Pagination from '../generic/Pagination';
import ReactTable from '../generic/SelectableReactTable';

class TradeHistory extends React.Component {
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
        Header: SortableHeader('Date'),
        accessor: 'date',
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
        accessor: 'amount',
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
      },
    ];
  }
  renderTable() {
    const data = [{date: '123', type: 'Buy', price: 1, curency: 'BTC', amount: 3, total: 4, tx: ''}, {date: '123', type: 'Sell', price: 2, curency: 'BTC', amount: 5, total: 2, tx: ''}];
    return (
      <div>
        <Desktop>      
          <ReactTable
            data={data}
            columns={this.getColumns()}
            onItemSelected={() => {}}
          />
        </Desktop>
        <Mobile>
          <ReactTable
            data={data}
            columns={this.getColumns()}
            onItemSelected={() => {}}
            minRows={5}
            showPagination={true}
            defaultPageSize={5}
            PaginationComponent={Pagination}                
          />        
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
