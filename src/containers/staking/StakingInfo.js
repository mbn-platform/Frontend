import React from 'react';
import BigNumber from 'bignumber.js';
import { Col, Row, Button } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import ProgressBar from '../../components/ProgressBar';

class StakingInfo extends React.Component {
  renderInfo() {
    const style = {
      width: 240,
      height: '20',
      fontSize: '11px',
    };
    const { info: { earlyPool } } = this.props;
    const limit = new BigNumber(earlyPool.limit);
    const total = new BigNumber(earlyPool.total);
    const progress = new BigNumber(total).div(limit).times(100);
    return (
      <div className="info">
        <h3>Staking structure</h3>
        <Row>
          <Col xs="12" md="6">
            <div>User can receive rewards for staking MBN tokens.</div>
            <br/>
            {this.renderLevelsTable()}
            <br/>
          </Col>
          <Col xs="12" md="6" className="align-self-center">

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
          </Col>
        </Row>
        <div><b>The reward is calculated as a:</b></div>
        <div>Personal reward = Total reward / Personal share in staking pool</div>
        <div>ETH payment comes from COF operation profit. 10% of COF profit will be distributed for users, who apply for staking level 2.</div>
        <div>Rewards are sended to users every week, on monday.
          Size of stacking rewards have a schedule, based on timeline.</div>
        <br/>
        <div>To receive staking rewards you apply the pool and have a 1-month long reward maturation period. Withdrawing tokens from the wallet will restart the reward maturation.</div>
        <br/>
        <h5>Schedule of stacking rewards in MBN and ETH:</h5>
        <br/>
        <h6>Early Investors pool</h6>
        <div>{total.div(1e18).toFixed(0)} of {limit.div(1e24).toFixed()}M</div>
        <ProgressBar progress={progress.toNumber()} />
        {this.renderEarlyTable()}
        <br/>
        <h6>Global pool</h6>
        {this.renderGeneralTable()}
        <br />
        <div><b>Example 1:</b> User has 200,000 MBN and commits 150,000 MBN to Early Investors Pool. If balance of the user at the moment of reward calculation is lower than 150,000 MBN, the user will not receive rewards and will be excluded from Early Investors Pool</div>
        <div><b>Example 2:</b> User has 200,000 MBN on his address. That conforms with the Level 2. If during 4 weeks User's MBN balance doesn't descrease, the user will start to receive staking rewards every week according to the Global Pool percentage table</div>
        <div><b>Example 3:</b> User has 150,000 MBN on his address and completed maturation period. If at the moment of reward calculations user's balance decreases relative to the last week, but does not drops below 100,000 MBN, the maturation perdiod will start anew</div>
      </div>
    );
  }

  renderEarlyTable() {
    const now = Date.now();
    return (
      <div style={{overflowX: 'auto'}}>
        <table>
          <thead>
            <tr>
              <th style={{width: '140px'}}>Timeline</th>
              <th>weekly</th>
              <th>monthly</th>
              <th>annually</th>
              <th style={{width: '140px', whiteSpace: 'unset'}}>COF profit reward (ETH payments)</th>
            </tr>
          </thead>
          <tbody>
            {this.stackingData.map((d, i) => {
              let className;

              const until = d[6];
              if ((now - until) > 0) {
                className = 'stale';
              } else if (now - d[5] > 0) {
                className = 'active';
              }
              return (
                <tr className={className} key={i}>
                  <td>{d[0]}</td>
                  <td>
                    <div>Lvl 1 - {d[1][0]}%</div>
                    <div>Lvl 2 - {d[1][1]}%</div>
                    <div>Lvl 3 - {d[1][2]}%</div>
                    <div>Lvl 4 - {d[1][3]}%</div>
                  </td>
                  <td>
                    <div>Lvl 1 - {d[2][0]}%</div>
                    <div>Lvl 2 - {d[2][1]}%</div>
                    <div>Lvl 3 - {d[2][2]}%</div>
                    <div>Lvl 4 - {d[2][3]}%</div>
                  </td>
                  <td>
                    <div>Lvl 1 - {d[3][0]}%</div>
                    <div>Lvl 2 - {d[3][1]}%</div>
                    <div>Lvl 3 - {d[3][2]}%</div>
                    <div>Lvl 4 - {d[3][3]}%</div>
                  </td>
                  <td>
                    <div>Lvl 1 - {d[4][0]}%</div>
                    <div>Lvl 2 - {d[4][1]}%</div>
                    <div>Lvl 3 - {d[4][2]}%</div>
                    <div>Lvl 4 - {d[4][3]}%</div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  renderGeneralTable() {
    const now = Date.now();
    return (
      <div style={{overflowX: 'auto'}}>
        <table>
          <thead>
            <tr>
              <th style={{width: '140px'}}>Timeline</th>
              <th>weekly</th>
              <th>monthly</th>
              <th>annually</th>
              <th style={{width: '140px', whiteSpace: 'unset'}}>COF profit reward (ETH payments)</th>
            </tr>
          </thead>
          <tbody>
            {this.globalPool.map((d, i) => {
              let className;

              const until = d[6];
              if ((now - until) > 0) {
                className = 'stale';
              } else if (now - d[5] > 0) {
                className = 'active';
              }
              return (
                <tr className={className} key={i}>
                  <td>{d[0]}</td>
                  <td>
                    <div>Lvl 1 - {d[1][0]}%</div>
                    <div>Lvl 2 - {d[1][1]}%</div>
                    <div>Lvl 3 - {d[1][2]}%</div>
                    <div>Lvl 4 - {d[1][3]}%</div>
                  </td>
                  <td>
                    <div>Lvl 1 - {d[2][0]}%</div>
                    <div>Lvl 2 - {d[2][1]}%</div>
                    <div>Lvl 3 - {d[2][2]}%</div>
                    <div>Lvl 4 - {d[2][3]}%</div>
                  </td>
                  <td>
                    <div>Lvl 1 - {d[3][0]}%</div>
                    <div>Lvl 2 - {d[3][1]}%</div>
                    <div>Lvl 3 - {d[3][2]}%</div>
                    <div>Lvl 4 - {d[3][3]}%</div>
                  </td>
                  <td>
                    <div>Lvl 1 - {d[4][0]}%</div>
                    <div>Lvl 2 - {d[4][1]}%</div>
                    <div>Lvl 3 - {d[4][2]}%</div>
                    <div>Lvl 4 - {d[4][3]}%</div>
                  </td>
                </tr>
              );
            })}
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
            <th>Requirements (MBN)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Lvl1</td>
            <td>100,000</td>
          </tr>
          <tr>
            <td>Lvl2</td>
            <td>300,000</td>
          </tr>
          <tr>
            <td>Lvl3</td>
            <td>1,000,000</td>
          </tr>
          <tr>
            <td>Lvl4</td>
            <td>3,000,000</td>
          </tr>
        </tbody>
      </table>
    );
  }

  stackingData = [
    ['jan20’-dec20’', [0.35, 0.35, 0.46, 0.7], [1.5, 1.5, 2, 3], [20, 20, 27, 43], [0, 10, 10, 15], new Date('2020-01-01'), new Date('2021-01-01')],
  ]

  globalPool = [
    ['jan20’-dec20’', [0.29, 0.29, 0.38, 0.6], [1.24, 1.24, 1.67, 2.4], [16, 16, 22, 36], [0, 10, 10, 15], new Date('2020-01-01'), new Date('2021-01-01')],
  ]


  render() {
    const { setRenderItem, verifyStakeAddress } = this.props;
    const isVerified = this.props.info.verified;

    return (
      <div>
        {this.renderInfo()}
        <Button onClick={isVerified ? setRenderItem('personal') : verifyStakeAddress}>
          <FormattedMessage id={isVerified ? 'staking.viewStats' : 'staking.start'} />
        </Button>
      </div>
    );
  }
}
export default StakingInfo;
