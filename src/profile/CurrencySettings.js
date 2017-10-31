import React from 'react';
import classNames from 'classnames';
import { Col, Container, Row } from 'reactstrap';
import ReactTable from '../generic/SelectableReactTable';
import SearchHeader from '../generic/SearchHeader';
import { UncontrolledTooltip } from 'reactstrap';

class CurrencySettings extends React.Component {

  constructor(props) {
    super(props);
    this.state = {filtered: [{id: 'currency', value: ''}, {id: 'selected', value: 'all'}]};
    this.onCurrencyChange = this.onCurrencyChange.bind(this);
    this.onCurrencyToggle = this.onCurrencyToggle.bind(this);
  }

  onCurrencyToggle(row) {
    const preferred = !row.original.preferred;
    const update = {name: row.original.name, preferred};
    this.props.onCurrencyToggle(update);
  }

  onCurrencyChange(e) {
    this.setState({filtered: [{id: 'currency', value: e.target.value}]});
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
        Header: SortableTableHeader('Trade volume'),
        className: 'table_col_value',
        accessor: 'tradeVolume'
      }, {
        Header:  SortableTableHeader('ROI, %'),
        className: 'table_col_value',
        accessor: 'roi'
      }, {
        id: 'selected',
        maxWidth: 80,
        Header: StatusHeader(this.onSelectAllClicked),
        Cell: row => (
          <span onClick={e => {
            e.stopPropagation();
            this.onCurrencyToggle(row);
          }}
          className={classNames('icon', 'icon-star', {active: row.original.preferred})}
        />),
        accessor: 'preferred',
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
const SortableTableHeader = header => (
  <div className="table_header_wrapper">
    <div className="table_header">{header}</div>
    <div className="sort_icon_wrapper">
      <div className="green_arrow"></div>
    </div>
  </div>
);
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
    <div className="table_header_wrapper contract_header_wrapper">
      <div className="table_header">
        <span className="icon icon-star"/>
      </div>
      <div id="help-icon-preferred-currencies" className="table_header_help_wrapper" style={{paddingTop: 32, marginLeft: 0}}></div>
      <UncontrolledTooltip target="help-icon-preferred-currencies" placement="right">
        Choose your preferred currencies
      </UncontrolledTooltip>
      <div className="sort_icon_wrapper">
        <div className="green_arrow"></div>
      </div>
    </div>
  );
};


export default CurrencySettings;

