import React from 'react';
import {connect} from 'react-redux';
import { Container, Row, Col } from 'reactstrap';
import HeaderStatus from '../../components/HeaderStatus';
import { FormattedMessage, FormattedDate, injectIntl } from 'react-intl';
import {
  getOrderInfo,
  getOrderListPage,
} from '../../actions/orderList';
import ReactTable from '../../components/SelectableReactTable';
import { Screen } from '../../MediaQuery';
import {getExchangeMarkets, selectExchange} from '../../actions/terminal';


class OrdersPage extends React.Component {
  componentDidMount() {
    const {getOrderInfoPage, getOrderList, location, selectExchange, exchange} = this.props;
    const currentOrderId = location.pathname.substring(location.pathname.indexOf('/', 1) + 1);
    selectExchange(exchange);
    getOrderInfoPage(currentOrderId);
    getOrderList(currentOrderId);
  };

  getOrderListColumn = screenWidth => {
    return [
      {
        Header: this.props.intl.messages['order.event'],
        className: 'table_col_value order__table-cell order__table-cell_uppercase',
        headerClassName: 'order__table-title',
        minWidth: 60,
        Cell: row => {
          const currentType = row.original.type.substring(row.original.type.indexOf('_') + 1);
          return (<div>
            {currentType}
          </div>);
        }
      },
      {
        Header: this.props.intl.messages['order.details'],
        className: 'table_col_value order__table-cell order__table-cell_uppercase',
        headerClassName: 'order__table-title',
        minWidth: 60,
        Cell: row => {
          const currentDetails = row.original.params.fill || row.original.params.reason || '-';
          return (<div>
            {currentDetails}
          </div>);
        }
      },
      {
        Header: this.props.intl.messages['order.createdAt'],
        className: 'table_col_value order__table-cell',
        headerClassName: 'order__table-title',
        minWidth: screenWidth  === 'lg' ?  100 : 70,
        Cell: row => (
          <div>
            <FormattedDate
              value={new Date(row.original.createdAt)}
              year='numeric'
              month='2-digit'
              day='2-digit'
              hour="numeric"
              minute="numeric"
            />
          </div>
        ),
      },
      {
        Header: this.props.intl.messages['order.tx'],
        className: 'table_col_value order__table-cell',
        headerClassName: 'order__table-title',
        minWidth: 60,
        accessor: 'hash',
      }
    ];
  };

  renderOrderListTable = () => {
    const { ordersList } = this.props;
    return (
      <Screen on={screenWidth => (
        <ReactTable
          data={ordersList}
          columns={this.getOrderListColumn(screenWidth)}
          onItemSelected={() => {}}
          scrollBarHeight={screenWidth === 'lg' ? 348 : 200}
        />)} />
    );
  }



  renderInfoBlock = () => {
    const { orderInfo } = this.props;
    return (
      <div className="order__info">
        <div className="order__info-title">
          <FormattedMessage
            id="order.details"
            defaultMessage="Details"
          />
        </div>
        <div className="order__info-container">
          <div className="order__info-item">
            <div className="order__info-subtitle">
              <FormattedMessage
                id="order.type"
                defaultMessage="Type"
              />
            </div>
            <div className="order__info-value">
              {orderInfo.type}
            </div>
          </div>
          <div className="order__info-item">
            <div className="order__info-subtitle">
              <FormattedMessage
                id="order.exchange"
                defaultMessage="Exchange"
              />
            </div>
            <div className="order__info-value">
              {orderInfo.exchange}
            </div>
          </div>
          <div className="order__info-item">
            <div className="order__info-subtitle">
              <FormattedMessage
                id="order.market"
                defaultMessage="Market"
              />
            </div>
            <div className="order__info-value">
              {orderInfo.symbol}
            </div>
          </div>
          <div className="order__info-item">
            <div className="order__info-subtitle">
              <FormattedMessage
                id="order.price"
                defaultMessage="Price, USDT"
              />
            </div>
            <div className="order__info-value">
              {orderInfo.price}
            </div>
          </div>
          <div className="order__info-item">
            <div className="order__info-subtitle">
              <FormattedMessage
                id="order.value"
                defaultMessage="Value"
              />
            </div>
            <div className="order__info-value">
              {orderInfo.amount}
            </div>
          </div>
          <div className="order__info-item">
            <div className="order__info-subtitle">
              <FormattedMessage
                id="order.fill"
                defaultMessage="Fill"
              />
            </div>
            <div className="order__info-value">
              {orderInfo.filled}
            </div>
          </div>
        </div>
      </div>
    );
  }


  render() {
    const { exchangeInfo } = this.props;
    const currentOrderId = this.props.location.pathname.substring(this.props.location.pathname.indexOf('/', 1) + 1);
    return (
      <React.Fragment>
        <HeaderStatus
          {...exchangeInfo}
        />
        <div className="order__order-page-main-wrapper">
          <Row className="order__order-page-container">
            <Col>
              <div className="order__order-page-title">
                <FormattedMessage
                  id="order.title"
                  defaultMessage="ORDER #{orderNumber}"
                  values={{orderNumber: currentOrderId}}
                />
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs="12" sm="12" md="4" lg="4">
              {this.renderInfoBlock()}
            </Col>
            <Col xs="12" sm="12" md="8" lg="8">
              <div className='order__history-table-wrapper'>
                <div className="order__info-title">
                  <FormattedMessage
                    id="order.history"
                    defaultMessage="History"
                  />
                </div>
                {this.renderOrderListTable()}
              </div>
            </Col>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  const { order: {orderInfo, ordersList}, exchangesInfo } = state;
  return {
    orderInfo,
    ordersList,
    exchangeInfo: state.exchangesInfo[state.terminal.exchange],
    exchange: state.terminal.exchange,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getOrderInfoPage: orderId => dispatch(getOrderInfo(orderId)),
    getOrderList: orderId => dispatch(getOrderListPage(orderId)),
    selectExchange: exchange => {
      dispatch(selectExchange(exchange));
      dispatch(getExchangeMarkets(exchange));
    },
  };
};


export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(OrdersPage));
