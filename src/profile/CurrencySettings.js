import React from 'react';
import classNames from 'classnames';
import { Col, Container, Row } from 'reactstrap';
import ReactTable from '../generic/SelectableReactTable';
import SearchHeader from '../generic/SearchHeader';

class CurrencySettings extends React.Component {

  constructor(props) {
    super(props);
    this.state = {filtered: [{id: 'currency', value: ''}, {id: 'selected', value: 'all'}]};
  }

  render() {
    return (
      <Col xs="12" sm="12" md="12" lg="12" xl="5" className="currency-block">
        <Container fluid className="h-100">
          <Row className="h-100">
            <Col xs="12" className="currency-settings">
              <div className="card">
                <div className="card-header">
                  <div className="container-fuild h-100">
                    <div className="row align-items-center">
                      <div className="col-auto title-text">
                        <span className="icon icon-profit icon-002-circle"></span>CURRENCY SETTINGS
                      </div>
                    </div>
                    <div className="row align-items-center d-flex d-md-none choose-header-block justify-content-center">
                      <div className="col-12  d-flex justify-content-center">
                        <div className="change-currency-block">
                          Choose your prefered currencies by clicking on <span className="icon icon-star"></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  {this.renderTable()}
                  <div className="d-flex d-md-none justify-content-center show-next-block">
                    <button type="button" className="btn btn-secondary">show next 10 currencies</button></div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </Col>
    );
  }

  renderTable() {
    const currencyFilter = this.state.filtered.find(f => f.id === 'currency').value;
    const columns = [
      {
        Header: SearchHeader('Currency', currencyFilter, this.onCurrencyChange),
        id: 'currency',
        accessor: 'name',
        className: 'table_col_value'
      }, {
        Header: (<div className="table_header_wrapper">
          <span className="table_header">Trade volume</span>
          <div className="sort_icon_wrapper" style={{display: 'block', margin: 0}}>
            <div className="green_arrow green_arrow_bottom" ></div>
          </div>
        </div>),
        className: 'table_col_value',
        accessor: 'amount'
      }, {
        Header: (<div className="table_header_wrapper">
          <span className="table_header">ROI, %</span>
          <div className="sort_icon_wrapper" style={{display: 'block', margin: 0}}>
            <div className="green_arrow green_arrow_bottom" ></div>
          </div>
        </div>),
        className: 'table_col_value',
        accessor: 'amount'
      }, {
        id: 'selected',
        Header: StatusHeader(this.onSelectAllClicked),
        Cell: StatusCell(this.onCurrencyStateClicked),
        accessor: 'selected',
        filterMethod: (filter, row) => {
          if(filter.value === 'all') {
            return true;
          } else {
            return filter.value === row.selected;
          }
        }
      },
    ];

    const scrollBarHeight = this.state.changed ? 217 - 44 : 217;

    return (
      <ReactTable
        style={{height: 312}}
        data={this.props.currencies}
        columns={columns}
        filtered={this.state.filtered}
        onItemSelected={() => {}}
        scrollBarHeight={scrollBarHeight}
      />
    );

  }
}
const StatusCell = (onClick, apiKey) => rowInfo => {
  const handler = e => {
    e.stopPropagation();
    onClick(rowInfo.original);
  };
  const className = classNames('currency_status_checkbox', {selected: rowInfo.value});
  return (<div onClick={handler} className={className}/>);
};

const StatusHeader = (onSelectAllClicked) => {
  return (
    <div className="table_header_wrapper">
      <span className="table_header">Status</span>
      <div className="table_header_help_wrapper">
        <div className="table_header_help_text">This is a link on etherscan.io which contains all details of your contract.</div>
      </div>
      <div className="sort_icon_wrapper" style={{marginLeft: 20}}>
        <div className="green_arrow green_arrow_bottom" ></div>
      </div>
      <div className="title_green_arrows_wrapper">
        <div onClick={onSelectAllClicked} className="currency_select_all">All</div>
        <div className="currency_status_checkbox selected"></div>
      </div>
    </div>
  );
};


export default CurrencySettings;

