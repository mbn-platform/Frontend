import React from 'react';
import classNames from 'classnames';
import { Col, Container, Row, UncontrolledTooltip } from 'reactstrap';
import { FormattedMessage, injectIntl } from 'react-intl';

import SearchHeader from 'components/SearchHeader';

class CurrencySettings extends React.Component {
  state = {
    filtered: [{ id: 'currency', value: '' }, { id: 'selected', value: 'all' }],
    containerHeight: 344,
  };

  divRef = React.createRef();

  onCurrencyToggle = (row) => {
    const preferred = !row.original.preferred;
    const update = { name: row.original.name, preferred };
    this.props.onCurrencyToggle(update);
  };

  onCurrencyChange = (e) => {
    this.setState({ filtered: [{ id: 'currency', value: e.target.value }] });
  };

  componentDidMount = () => {
    setTimeout(() => { this.calcHeight(); }, 1);
  };

  calcHeight = () => {
    this.setState({ containerHeight: this.divRef.clientHeight });
  };

  render = () => (
    <Col xs="12" sm="12" md="12" lg="12" xl="5" className="currency-block">
      <Container fluid className="h-100">
        <Row className="h-100">
          <Col xs="12" className="currency-settings">
            <div className="card">
              <div className="card-header">
                <div className="container-fuild h-100">
                  <div className="row align-items-center">
                    <div className="col-auto title-text">
                      <span className="icon icon-profit icon-002-circle"/>
                      <FormattedMessage
                        id="profile.currencyPreferences"
                        defaultMessage="CURRENCY PREFERENCES"
                      />
                    </div>
                  </div>
                  <div className="row align-items-center d-flex d-md-none choose-header-block justify-content-center">
                    <div className="col-12  d-flex justify-content-center">
                      {this.props.own ? (
                        <div className="change-currency-block">
                          <FormattedMessage
                            id="profile.chooseYourCurrenciesByClick"
                            defaultMessage="Choose your prefered currencies by clicking on"
                          />
                          <span className="icon icon-star"/>
                        </div>
                      ) : (
                        <div className="change-currency-block">
                          <FormattedMessage
                            id="profile.chooseYourCurrenciesWithBr"
                            defaultMessage="Currencies preferred {br} by trader"
                            values={{ br: <br/> }}
                          />
                          <span className="icon icon-star"/>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-body" ref={this.divRef}>
                <div className="under_construction">
                  <FormattedMessage
                    id="profile.underConstruction"
                    defaultMessage="Under construction"
                  />
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </Col>
  );

  getColumns() {
    const currencyFilter = this.state.filtered.find(f => f.id === 'currency').value;

    return [
      {
        Header: SearchHeader(this.props.intl.messages['profile.currency'], currencyFilter, this.onCurrencyChange),
        id: 'currency',
        accessor: 'name',
        minWidth: 80,
        className: 'table_col_value'
      }, {
        Header: SortableTableHeader(this.props.intl.messages['profile.tradeVolume']),
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
}

const SortableTableHeader = header => (
  <div className="table_header_wrapper contract_header_wrapper">
    <div className="table_header">{header}</div>
    <div className="sort_icon_wrapper">
      <div className="green_arrow"/>
    </div>
  </div>
);

const StatusHeader = (onSelectAllClicked, own) => (
  <div className="table_header_wrapper contract_header_wrapper">
    <div className="table_header">
      <span className="icon icon-star"/>
    </div>
    <div id="help-icon-preferred-currencies" className="table_header_help_wrapper" style={{paddingTop: 32, marginLeft: 0}}/>
    <UncontrolledTooltip target="help-icon-preferred-currencies" placement="right">
      {own
        ? this.props.intl.messages['chooseYourCurrencies']
        : this.props.intl.messages['currenciesPreferredByTrader']
      }
    </UncontrolledTooltip>
    <div className="sort_icon_wrapper">
      <div className="green_arrow"/>
    </div>
  </div>
);

export default injectIntl(CurrencySettings);
