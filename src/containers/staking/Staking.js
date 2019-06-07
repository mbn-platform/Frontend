import React from 'react';
import { connect } from 'react-redux';
import { verifyStakeAddress, getStakeInfo, getStakeTransactions, setTrListPage, setTrListPageSize} from '../../actions/profile';
import { Container, Row, Col, Button } from 'reactstrap';
import { FormattedMessage, FormattedDate } from 'react-intl';
import ReactTable from '../../components/SelectableReactTable';
import PaginationWithPage from '../../components/PaginationWithPage';
import BigNumber from 'bignumber.js';

class Staking extends React.Component {

  componentDidMount() {
    this.props.getStakeInfo();
  }
  render() {
    const {info} = this.props;
    if (info.address) {
      return (
        <StakeInfo info={info}
          getPage={this.props.getPage}
          setPage={this.props.setPage}
          setPageSize={this.props.setPageSize}
          trs={this.props.trs}
        />
      );
    } else if (info.verified === false) {
      return <NoStaking verifyStakeAddress={this.props.verifyStakeAddress}/>;
    } else {
      return null;
    }
  }
}

class NoStaking extends React.Component {


  renderInfo() {
    return (
      <div className="info">
        <h3>Staking structure</h3>
        <div>User can receive rewards for staking MBN tokens.</div>
        <br/>
        {this.renderLevelsTable()}
        <br/>
        <div>For presale participants, staking is automatically enabled for their purchased amount. Rewards that were already staked will be send to them before listing.</div>
        <br/>
        <div><b>The reward is calculated as a:</b></div>
        <div>Personal reward = Total reward / Personal share in staking pool</div>
        <br/>
        <div>BTC payment comes from COF operation profit and from IEO. 10% of COF profit will be used for rewarding and 5% of money, attracted during IEO on ABCC, will be distributed for users, who apply for staking level 2.</div>
        <br/>
        <div>Rewards are sended to users every week, on monday.
          Size of stacking rewards have a schedule, based on timeline.</div>
        <br/>
        <h5>Schedule of stacking rewards in MBN and BTC:</h5>
        <br/>
        {this.renderTable()}
        <br/>
        <div><b>Example 1:</b> User has invested $1000 during presale. He commits his tokens for level 1 staking and receives tokens worth of $75 during each month of stage 2 and so on.</div>
        <br/>
        <div><b>Example 2:</b> User has invested $4000 during presale. He invested $2000 more to have level 2 staking reward. By staking it, he receives tokens worth of $330 each month during stage 3, part of COF profits (total of 10%) and also part of funds raised during IEO (total of 5%).</div>
      </div>
    );
  }

  renderTable() {
    return (
      <div style={{overflowX: 'auto'}}>
        <table>
          <thead>
            <tr>
              <th />
              <th style={{width: '140px', whiteSpace: 'unset'}}>Minimum stack required</th>
              <th style={{width: '140px'}}>Timeline</th>
              <th>Token reward (MBN)</th>
              <th>Token reward (MBN)</th>
              <th style={{width: '140px', whiteSpace: 'unset'}}>COF profit reward (BTC,only Lv2)</th>
              <th style={{width: '150px', whiteSpace: 'unset'}}>IEO share reward (BTC,only Lv2)</th>
            </tr>
          </thead>
          <tbody>
            {this.stackingData.map((d, i) => (
              <tr key={i}>
                <td>{d[0]}</td>
                <td>
                  <div>Lvl 1 - {i <= 1 ? '150$': '600$'}</div>
                  <div>Lvl 2 - 6000$</div>
                </td>
                <td>{d[1]}</td>
                <td>{d[2]}</td>
                <td>{d[3]}</td>
                <td>{d[4]}</td>
                <td>{d[5]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  renderLevelsTable() {
    return (
      <table>
        <colgroup>
          <col width="100" className="test"/>
          <col width="150" />
          <col width="130" />
        </colgroup>
        <thead>
          <tr>
            <th>Level</th>
            <th>Rewards</th>
            <th>Requirements (MBN)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Lv1</td>
            <td>Tokens</td>
            <td>$150/$500 worth</td>
          </tr>
          <tr>
            <td>Lv2</td>
            <td>Super-user status,tokens and <b>BTC payment</b></td>
            <td>$6000 worth</td>
          </tr>
        </tbody>
      </table>
    );
  }

  stackingData = [
    ['Stage 1', 'dec18’-feb19’', '0.3% daily', '9% monthly', '-', '-'],
    ['Stage 2', 'mar19’-may19’', '0.25% daily', '7.5% monthly', '-', '2%'],
    ['Stage 3', 'june19’-aug19’', '0.2% daily', '6% monthly', '10%', '1%'],
    ['Stage 4', 'sep19’-nov19’', '0.1% daily', '3% monthly', '10%', '1%'],
    ['Stage 5', 'dec19’-feb20’', '0.05% daily', '1.5% monthly', '10%', '1%'],
    ['Stage 6', 'mar20’-may20’', '0.033% daily', '1% monthly', '10%', '-'],
    ['Stage 7+', 'june20’ and further', '0.016% daily', '0.5% monthly', '10%', '-'],
  ]


  render() {
    return (
      <Container fluid className="ratings staking">
        <Row>
          <Col xs="12" sm="12" md="12" lg="12">
            <div className="hashlog__main">
              <div className="hashlog__main-title">
                <FormattedMessage
                  id="staking.title"
                  defaultMessage="Staking"
                />
              </div>
              <div className="hashlog__main-board">
                {this.renderInfo()}
                <Button onClick={this.props.verifyStakeAddress}>Start</Button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

class StakeInfo extends React.Component {

  componentDidMount() {
    const {getPage, trs : {page, pageSize}} = this.props;
    getPage(page, pageSize);
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
      Header: 'Bonus',
      className: 'table_col_value hashlog__table-cell hashlog__table-cell_hash-value pair',
      headerClassName: 'hashlog__table-header-title',
      Cell: row => BigNumber(row.value).div(1e18).toFixed(2),
      accessor: 'amount',
    },
  ]

  renderInfo() {
    const info = this.props.info;
    return (
      <div className='info'>
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
        <div>Address: {info.address}</div>
        <div>Balance: {BigNumber(info.balance).div(1e18).toFixed(8)} MBN</div>
        <div>Total Bonus: {BigNumber(info.totalBonus).div(1e18).toFixed(8)} MBN</div>
        <div>Current level: {info.level}</div>
        {this.renderLevelInfo(info)}
      </div>
    );
  }

  getNextLevelRequired(info) {
    const currentValue = BigNumber(info.balance).div(1e18);
    let required;
    if (info.level === 0) {
      required = BigNumber(500).div(info.tokenPrice).toFixed();
    }
    if (info.level === 1) {
      required = BigNumber(6000).div(info.tokenPrice).toFixed();
    }
    const toNextLevel = BigNumber(required).minus(currentValue).toFixed(8);
    return toNextLevel;
  }

  renderLevelInfo(info) {
    switch (info.level) {
      case 2:
        return null;
      case 1:
      case 0:
        return (
          <div>You need {this.getNextLevelRequired(info)} MBN to level {info.level + 1}</div>
        );
      default:
        throw new Error();
    }
  }

  render() {
    return (
      <Container fluid className="ratings staking">
        <Row>
          <Col xs="12" sm="12" md="12" lg="12">
            <div className="hashlog__main">
              <div className="hashlog__main-title">
                <FormattedMessage
                  id="staking.title"
                  defaultMessage="Staking"
                />
              </div>
              <div className="hashlog__main-board">
                {this.renderInfo()}
                <br/>
                <h6>Staking Rewards</h6>
                {this.renderTable()}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  info: state.stakeInfo,
  trs: state.stakeTr,
});

const mapDispatchToProps = (dispatch) => ({
  verifyStakeAddress: () => dispatch(verifyStakeAddress()),
  getStakeInfo: () => dispatch(getStakeInfo()),
  getPage: (pages, size) => dispatch(getStakeTransactions(pages, size)),
  setPage: page => dispatch(setTrListPage(page)),
  setPageSize: pageSize => dispatch(setTrListPageSize(pageSize)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Staking);
