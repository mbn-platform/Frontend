import React from 'react';
import { Col, Row, Button } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import { EarlyPoolProgress } from './EarlyPoolProgress';

class StakingInfo extends React.Component {
  renderInfo() {
    const style = {
      width: 240,
      height: '20',
      fontSize: '11px',
    };
    const { info: { earlyPool } } = this.props;
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
        <div>ETH payment comes from COF operation profit. 10% of COF profit will be distributed for users, who apply for staking Level 2, Level 3 and 15% of COF profit for Level 4.</div>
        <div>Rewards are sended to users every week, on monday. Size of staking rewards have a schedule, based on pools.</div>
        <br/>
        <div>To receive staking rewards you apply the pool and have a 1-month long reward maturation period. Withdrawing tokens from the wallet will restart the reward maturation.</div>
        <br/>
        <h5>Schedule of staking rewards in MBN and ETH:</h5>
        <br/>
        <h6>Early Adopters pool</h6>
        <div style={{maxWidth: '550px'}}>
          <EarlyPoolProgress {...earlyPool} />
        </div>
        {this.renderEarlyTable()}
        <br/>
        <h6>General pool</h6>
        {this.renderGeneralTable()}
        <br/>
        <div><b>Example 1:</b> John has 3,450,000 MBN. He can commit 3,000,000 MBN to the Early adopters pool and get maximum rate for the rewards. He can not sell this stake. If he do – all of 3,000,000 goes to the General pool. Also, he loses his reward for the current week and other investors from Early pool share it. The remaining 450,000 MBN he has commited to the General pool. He can sell rewards or full stake amount from this pool.</div>
        <br/>
        <div><b>Example 2:</b> John has 450,000 MBN in the General pool. If he sells rewards, he loses rewards for the current week from the General pool. The remaining balance goes to the maturation period for 1 month without rewards.</div>
        <br/>
        <div><b>Example 3:</b> Alice has 1,300,000 MBN. She has committed 1,000,000 MBN in the Early adopter's pool and 300,000 MBN in the General pool. She gains rewards from the Early pool and from the General pool at the same time. She can sell rewards paid out from the General pool. It means,  if her balance drop below 1,000,000 MBN + amount of paid rewards from the Early pool, she excludes from the Early pool.</div>
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
    const { verifyStakeAddress } = this.props;
    const isVerified = this.props.info.verified;
    return (
      <div>
        {this.renderInfo()}
        {isVerified ? null :
          <Button onClick={verifyStakeAddress}>
            <FormattedMessage id='staking.start' />
          </Button>
        }
      </div>
    );
  }
}
export default StakingInfo;
