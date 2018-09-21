import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import { Desktop, Mobile } from '../../generic/MediaQuery';
import Pagination from '../../components/Pagination';
import ReactTable from '../../components/SelectableReactTable';
import { formatDate } from '../../generic/util';
import {FormattedMessage, injectIntl} from 'react-intl';

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
                        <span className="icon icon-profit icon-history-clock-button"/>
                        <FormattedMessage
                          id="profile.tradeHistory"
                          defaultMessage="TRADE HISTORY"
                        />
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
        Header: SortableHeader(this.props.intl.messages['profile.date']),
        accessor: trade => formatDate(new Date(trade.date)),
        minWidth: 50,
        className: 'table_col_value',
        sortable: false,
      },
      {
        Header: SortableHeader(this.props.intl.messages['profile.type']),
        Cell: TradeTypeCell,
        accessor: 'type',
        minWidth: 50,
        className: 'table_col_value text-capitalize',
        sortable: false,
      },
      {
        Header: SortableHeader(this.props.intl.messages['profile.price']),
        Cell: row =>  formatFloat(row.value, row.original.mainCurrency) + ' ' + row.original.mainCurrency,
        accessor: 'price',
        minWidth: 50,
        className: 'table_col_value',
        sortable: false,
      },
      {
        Header: SortableHeader(this.props.intl.messages['profile.amount']),
        id: 'amount',
        accessor: 'amount',
        Cell: row =>  formatFloat(row.value, row.original.amountCurrency) + ' ' + row.original.amountCurrency,
        minWidth: 50,
        className: 'table_col_value',
        sortable: false,
      },
      {
        Header: SortableHeader(this.props.intl.messages['profile.total']),
        Cell: row =>  formatFloat(row.value, row.original.mainCurrency) + ' ' + row.original.mainCurrency,
        accessor: 'total',
        minWidth: 50,
        className: 'table_col_value',
        sortable: false,
      },
      {
        Header: SortableHeader(this.props.intl.messages['profile.tx'], false),
        accessor: 'tx',
        sortable: false,
        minWidth: 30,
        className: 'table_col_value',
        Cell: rowInfo => rowInfo.original.first ? 
          (<a className="tx_link" target="_blank" href={rowInfo.value || '/'} />) // eslint-disable-line
          : null,
      },
    ];
  }
  renderTable() {
    const data = this.props.trades
      .sort((t1, t2) => t2.date - t1.date)
      .reduce((accum, value) => {
        if(value.length) {
          const first = value[0];
          const updatedFirst = {...first, first: true};
          value = value.slice(1);
          value.unshift(updatedFirst);
        }
        return accum.concat(value);
      }, []);
    return (
      <div>
        <Desktop>
          <div  className="profile_table_wrapper">
            <ReactTable
              getTrProps={(state, rowInfo) => {
                if(rowInfo.original.first) {
                  return {
                    className: 'first-row'
                  };
                } else {
                  return {};
                }
              }}
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
              getTrProps={(state, rowInfo, column, instance) => {
                if(rowInfo && rowInfo.original.first) {
                  return {
                    className: 'first-row'
                  };
                } else {
                  return {};
                }
              }}
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

function formatFloat(value, currency) {
  if(currency === 'USDT') {
    return value.toFixed(2);
  } else {
    return value.toFixed(8);
  }
}

const SortableHeader = (header, showSort = true) => (
  <div className="table_header_wrapper contract_header_wrapper">
    <span className="table_header">{header}</span>
    {showSort ? (
      <div className="sort_icon_wrapper" style={{display: 'block', margin: 0}}>
      </div>
    ) : null}
  </div>
);

const TradeTypeCell = row => {
  const className = row.original.type === 'buy' ? 'green' : 'red';
  return (<div className={className}>{row.original.type}</div>);
};

export default injectIntl(TradeHistory);
