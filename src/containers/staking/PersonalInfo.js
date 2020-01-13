import React from 'react';
import BigNumber from 'bignumber.js';
import { Col, Button, Row, Container } from 'reactstrap';
import ReactTable from '../../components/SelectableReactTable';
import PaginationWithPage from '../../components/PaginationWithPage';
import { FormattedDate, FormattedMessage } from 'react-intl';

class PersonalInfo extends React.Component {
  componentDidMount() {
    const {getPage, trs : {page, pageSize}, getStakeRating} = this.props;
    getPage(page, pageSize);
    getStakeRating();
  }

  renderTable() {
    const {
      trs: {list, count, page, pageSize},
      setPage,
      setPageSize,
      getPage,
    } = this.props;
    return (
      <ReactTable
        data={list}
        columns={this.columns}
        pages={Math.ceil(count/pageSize)}
        page={page}
        defaultPageSize={pageSize}
        pageSize={pageSize}
        showPagination={true}
        showPaginationBottom={true}
        manual
        paginationPageDispatcher={(p, ps) => {
          setPage(p);
          getPage(p, ps);
        }}
        paginationPageSizeDispatcher={ps => {
          setPageSize(ps);
        }}
        onItemSelected={() => {}}
        PaginationComponent={PaginationWithPage}
      />
    );
  }

  columns = [
    {
      Header: 'Time',
      className: 'table_col_value hashlog__table-cell hashlog__table-cell-time',
      headerClassName: 'hashlog__table-header-title',
      maxWidth: 300,
      Cell: row => (
        <div>
          <FormattedDate
            value={new Date(row.value)}
            year='numeric'
            month='2-digit'
            day='2-digit'
            hour="numeric"
            minute="numeric"
          />
        </div>
      ),
      accessor: 'date',
    },
    {
      Header: 'Bonus, MBN',
      className: 'table_col_value hashlog__table-cell hashlog__table-cell_hash-value pair',
      headerClassName: 'hashlog__table-header-title',
      Cell: row => BigNumber(row.value).div(1e18).toFixed(2),
      accessor: 'amount',
    },
  ]

  renderInfo() {
    const info = this.props.info;
    const style = {
      width: 240,
      height: '20',
      fontSize: '11px',
    };
    return (
      <div className='info'>
        <Row>
          <Col xs="12" md="6">
            <div>Staking is on</div>
            <div>Started: <FormattedDate
              value={new Date(info.createdAt)}
              year='numeric'
              month='2-digit'
              day='2-digit'
              hour="numeric"
              minute="numeric"
            />
            </div>
            <div style={{wordBreak: 'break-word'}}>Address: {info.address}</div>
            <div>Balance: {BigNumber(info.balance).div(1e18).toFixed(0, BigNumber.ROUND_FLOOR)} MBN</div>
            <div>Total Bonus: {BigNumber(info.totalBonus).div(1e18).toFixed(0, BigNumber.ROUND_CEIL)} MBN</div>
            <div>Current level: {info.level}. {this.renderLevelInfo(info)}</div>
            <Container>
              <Row>
                <Col>
                  <a href="https://idex.market/eth/mbn" target="_blank" rel="noopener noreferrer">
                    <Button style={style}>Buy on IDEX MBN/ETH</Button>
                  </a>
                </Col>
                <Col>
                  <a href="https://abcc.com/markets/mbnbtc" target="_blank" rel="noopener noreferrer">
                    <Button style={style}>Buy on ABCC MBN/BTC</Button>
                  </a>
                </Col>
              </Row>
              <Row>
                <Col>
                  <a href="https://www.probit.com/app/exchange/MBN-BTC" target="_blank" rel="noopener noreferrer">
                    <Button style={style}>Buy on ProBit MBN/BTC</Button>
                  </a>
                </Col>
                <Col>
                  <a href="https://coinmarketcap.com/currencies/membrana/" target="_blank" rel="noopener noreferrer">
                    <Button style={style}>View MBN on CoinMarketCap</Button>
                  </a>
                </Col>
              </Row>
            </Container>
          </Col>
          {this.renderStakingRating()}
        </Row>
      </div>
    );
  }

  renderStakingRating() {
    const rating = this.props.rating;
    return (
      <Col xs="12" md="6">
        <div>Staking rating</div>
        <StakingRating rating={rating} info={this.props.info} />
      </Col>
    );
  }

  getNextLevelRequired(info) {
    const currentValue = BigNumber(info.balance).div(1e18);
    let required;
    switch (info.level) {
      case 0:
        required = 100000;
        break;
      case 1:
        required = 300000;
        break;
      case 2:
        required = 1000000;
        break;
      case 3:
        required = 3000000;
        break;
      default:
        break;
    }
    const toNextLevel = BigNumber(required).minus(currentValue).toFixed(8);
    return toNextLevel;
  }

  renderLevelInfo(info) {
    switch (info.level) {
      case 4:
        return null;
      default:
        return (
          <span style={{color: '#346255'}}>You need {Math.ceil(this.getNextLevelRequired(info))} MBN to level {info.level + 1}</span>
        );
    }
  }

  render() {
    return (
      <div>
        {this.renderInfo()}
        <br/>
        <h6>Staking Rewards</h6>
        <Col xs="12" md="6">
          {this.renderTable()}
        </Col>
        <Col>
          <Button onClick={this.props.setRenderItem('info')}>
            <FormattedMessage id="staking.viewInfo" />
          </Button>
        </Col>
      </div>
    );
  }
}

const StakingRating = ({ info, rating }) => {
  const top = rating.slice(0, 3);
  return (
    <div className='staking-rating'>
      {top.map((r, i) =>
        <div
          className={info && info.address === r.address ? 'own' : null}
          key={i}>
          {r.place} {r.address} {Math.ceil(r.total)} (MBN)
        </div>
      )}
      {
        rating.length > 3 ? (
          <div key={4}>...</div>
        ) : null
      }
      {
        rating.length > 3 ? (
          <div className='own' key={5}>{rating[3].place} {rating[3].address} {Math.ceil(rating[3].total)} (MBN)</div>
        ) : null
      }
    </div>
  );
};

export default PersonalInfo;
