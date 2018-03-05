import React from 'react';
import classNames from 'classnames';
import { Col, Container, Row } from 'reactstrap';
import ReactTable from '../generic/SelectableReactTable';
import SearchHeader from '../generic/SearchHeader';
import { Desktop, Mobile } from '../generic/MediaQuery';
import Pagination from '../generic/Pagination';
import { UncontrolledTooltip } from 'reactstrap';

class CurrencySettings extends React.Component {

  constructor(props) {
    super(props);
    this.state = {filtered: [{id: 'currency', value: ''}, {id: 'selected', value: 'all'}],containerHeight: 344};
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

  componentDidMount() {
    setTimeout(() => {
      this.calcHeight();
    }, 1)
  }  

  calcHeight() {
    this.setState({containerHeight: this.divRef.clientHeight})
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
                        <span className="icon icon-profit icon-002-circle"></span>CURRENCY PREFERENCES
                      </div>
                    </div>
                    <div className="row align-items-center d-flex d-md-none choose-header-block justify-content-center">
                      <div className="col-12  d-flex justify-content-center">
                        {
                          this.props.own ? (
                            <div className="change-currency-block">
                              Choose your prefered currencies by clicking on <span className="icon icon-star"></span>
                            </div>
                          ) : (
                            <div className="change-currency-block">
                              Currencies preferred<br/> by trader <span className="icon icon-star"></span>

                            </div>
                          )
                        }
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body"  ref={element => this.divRef = element}>
                  <div className="under_construction">Under construction</div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </Col>
    );
  }

  getColumns() {
    const currencyFilter = this.state.filtered.find(f => f.id === 'currency').value;
    return [
      {
        Header: SearchHeader('Currency', currencyFilter, this.onCurrencyChange),
        id: 'currency',
        accessor: 'name',
        minWidth: 80,
        className: 'table_col_value'
      }, {
        Header: SortableTableHeader('Trade volume'),
        className: 'table_col_value',
        minWidth: 80,
        accessor: 'tradeVolume'
      }, {
        id: 'selected',
        minWidth: 80,
        Header: StatusHeader(this.onSelectAllClicked, this.props.own),
        Cell: row => (
          <span
            onClick={e => {
              e.stopPropagation();
              this.onCurrencyToggle(row);
            }}
            className={classNames('icon', 'icon-star', {active: row.original.preferred})}
          />
        ),
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

  }

  renderTable() {

    const scrollBarHeight = this.state.changed ? 217 - 44 : 217;

    return (
      <div>
        <Desktop>
          <div className="profile_table_wrapper">
            <ReactTable
              className="profile_table"
              data={this.props.currencies}
              columns={this.getColumns()}
              filtered={this.state.filtered}
              onItemSelected={() => {}}
              scrollBarHeight={scrollBarHeight}
              scrollBarHeightAuto='true'
            />
          </div>
        </Desktop>
        <Mobile>
          <ReactTable
            data={this.props.currencies}
            columns={this.getColumns()}
            filtered={this.state.filtered}
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
const SortableTableHeader = header => (
  <div className="table_header_wrapper contract_header_wrapper">
    <div className="table_header">{header}</div>
    <div className="sort_icon_wrapper">
      <div className="green_arrow"></div>
    </div>
  </div>
);

const StatusHeader = (onSelectAllClicked, own) => {
  return (
    <div className="table_header_wrapper contract_header_wrapper">
      <div className="table_header">
        <span className="icon icon-star"/>
      </div>
      <div id="help-icon-preferred-currencies" className="table_header_help_wrapper" style={{paddingTop: 32, marginLeft: 0}}></div>
      <UncontrolledTooltip target="help-icon-preferred-currencies" placement="right">
        {own ? 'Choose your preferred currencies' : 'Currencies preferred by trader'}
      </UncontrolledTooltip>
      <div className="sort_icon_wrapper">
        <div className="green_arrow"></div>
      </div>
    </div>
  );
};


export default CurrencySettings;

