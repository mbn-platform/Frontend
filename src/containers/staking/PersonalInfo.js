import React from 'react';
import BigNumber from 'bignumber.js';
import { Col, Button, Row, Container } from 'reactstrap';
import { FormattedDate } from 'react-intl';
import get from 'lodash/get';

import ReactTable from '../../components/SelectableReactTable';
import PaginationWithPage from '../../components/PaginationWithPage';
import { EarlyPoolProgress } from './EarlyPoolProgress';

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
    {
      Header: 'Pool',
      className: 'table_col_value hashlog__table-cell hashlog__table-cell_hash-value pair',
      headerClassName: 'hashlog__table-header-title',
      Cell: ({ value }) => {
        switch (value) {
          case 'early_adopters':
            return 'Early Adopters';
          case 'global':
            return 'Global';
          default:
            return '';
        }
      },
      accessor: 'pool',
    },
  ]

  renderInfo() {
    const { info: { earlyPool, earlyPoolStat, globalPoolStat, address } } = this.props;
    const stat = get(earlyPoolStat, 'stat');
    const isTimeRestriction = new Date() > new Date(earlyPool.endJoin);
    const canJoin = !isTimeRestriction && !earlyPoolStat.executed;
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
            <div style={{wordBreak: 'break-word'}}>Address: {address}</div>
            <br/>
            <h4>Early Pool Info</h4>
            {stat ? (
              <React.Fragment>
                <div>Tokens committed: {new BigNumber(stat.tokens).div(1e18).toFixed()} MBN</div>
                <div>Level: {stat.level}</div>
                <MaturationEnd date={stat.maturationEnd} />
                <div>Total bonus: {new BigNumber(stat.bonus).div(1e18).dp(2).toFixed()} MBN</div>
              </React.Fragment>
            ) : (
              <React.Fragment>
                {canJoin && <Button className='early-pool' onClick={this.props.showModal}>Commit tokens to the early pool</Button>}
                {earlyPoolStat.excluded && <div>You have been excluded from Early Pool</div>}
                {isTimeRestriction && <div>Early Pool is closed</div>}
              </React.Fragment>
            )}
            <br/>
            <h4>General Pool Info</h4>
            <div>Tokens committed: {new BigNumber(globalPoolStat.tokens).div(1e18).toFixed(0)} MBN</div>
            <div>Level: {globalPoolStat.level} {this.renderLevelInfo(globalPoolStat)}</div>
            <MaturationEnd date={globalPoolStat.maturationEnd} level={globalPoolStat.level} />
            <div>Total bonus: {new BigNumber(globalPoolStat.bonus).div(1e18).dp(2).toFixed()} MBN</div>

            <Container>
              <Row>
                <Col>
                  <a href="https://app.uniswap.org/#/swap?outputCurrency=0x4eeea7b48b9c3ac8f70a9c932a8b1e8a5cb624c7" target="_blank" rel="noopener noreferrer">
                    <Button style={style}>Buy on Uniswap MBN/ETH</Button>
                  </a>
                </Col>
                <Col>
                  <a href="https://idex.market/eth/mbn" target="_blank" rel="noopener noreferrer">
                    <Button style={style}>Buy on IDEX MBN/ETH</Button>
                  </a>
                </Col>
              </Row>
              <Row>
                <Col>
                  <a href="https://eterbase.exchange/markets/MBNUSDT" target="_blank" rel="noopener noreferrer">
                    <Button style={style}>BUY ON ETERBASE MBN/USDT</Button>
                  </a>
                </Col>
                <Col>
                  <a href="https://www.probit.com/app/exchange/MBN-BTC" target="_blank" rel="noopener noreferrer">
                    <Button style={style}>Buy on ProBit MBN/BTC</Button>
                  </a>
                </Col>
              </Row>
              <Row>
                <Col>
                  <a href="https://coinmarketcap.com/currencies/membrana/" target="_blank" rel="noopener noreferrer">
                    <Button style={style}>View MBN on CoinMarketCap</Button>
                  </a>
                </Col>
              </Row>
            </Container>
          </Col>
          {this.renderStakingRating(earlyPool)}
        </Row>
      </div>
    );
  }

  renderStakingRating(earlyPool) {
    const rating = this.props.rating;
    return (
      <Col xs="12" md="6">
        <div>Staking rating</div>
        <StakingRating rating={rating} info={this.props.info} />
        <br/>
        <div style={{maxWidth: '550px'}}>
          <EarlyPoolProgress {...earlyPool}/>
        </div>
      </Col>
    );
  }

  getNextLevelRequired(info) {
    const currentValue = BigNumber(info.tokens).div(1e18);
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
      </div>
    );
  }
}

const MaturationEnd = ({ date, level }) => {
  if (level === 0) {
    return null;
  }
  if (!date) {
    return null;
  } else {
    return (
      <div>
        Maturation ends:
        {' '}
        <FormattedDate
          value={new Date(date)}
          year='numeric'
          month='2-digit'
          day='2-digit'
          hour="numeric"
          minute="numeric"
        />
      </div>
    );
  }
};


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
