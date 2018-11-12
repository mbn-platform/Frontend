import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'reactstrap';
import classNames from 'classnames';
import {connect} from 'react-redux';

class HeaderStatus extends React.Component {

  render() {
    const rates = this.props.rates || {};
    const markets = this.props.markets || [];
    return (
      <header className="header-status">
        <Container fluid className="h-100">
          <Row className="h-100 justify-content-between">
            <Col xs="12" sm="12" md="8" lg="7" xl="4" className="curses-wrap row">
              <Rate
                pair="BTC/USDT"
                val={rates['USDT-BTC'] ? Math.floor(rates['USDT-BTC']) : ''}
                marketInfo={markets.find(m => m.symbol === 'USDT-BTC')}
              />
              <Rate
                pair="ETH/USDT"
                val={rates['USDT-ETH'] ? rates['USDT-ETH'].toFixed(2) : ''}
                marketInfo={markets.find(m => m.symbol === 'USDT-ETH')}
              />
              <Rate
                pair="ETH/BTC"
                val={rates['BTC-ETH'] ? rates['BTC-ETH'].toFixed(4) : ''}
                marketInfo={markets.find(m => m.symbol === 'BTC-ETH')}
              />
            </Col>
          </Row>
        </Container>
      </header>
    );
  }
}

HeaderStatus.propTypes = {
  rates: PropTypes.object,
  markets: PropTypes.array,
};

const Rate = ({ pair, marketInfo, val }) => {
  const prevDay = marketInfo && marketInfo.prevDay;
  const change = prevDay ? (val / prevDay * 100 - 100) : null;
  return (
    <Col sm="4" md="4" lg="4" xs="4" className="curses row h-100 align-items-center justify-content-between">
      <Col xs="auto" className="curses-name">{pair}</Col>
      <Col xs="auto" className="curses-val">{val}</Col>
      <Col xs="auto" className={classNames('curses-change', change > 0 ? 'up' : 'down')}>
        <span className={classNames('icon', 'icon-dir', change > 0 ? 'icon-up-dir' : 'icon-down-dir')}></span>
        {change ? change.toFixed(2) + '%' : ''}
      </Col>
    </Col>
  );
};

const mapStateToProps = state => {
  const {exchangesInfo, terminal: {exchange}} = state;
  return {
    ...exchangesInfo[exchange]
  };
};

export default connect(mapStateToProps)(HeaderStatus);
