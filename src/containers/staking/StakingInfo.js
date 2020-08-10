import React from 'react';
import { Col, Row, Button } from 'reactstrap';
import { FormattedMessage } from 'react-intl';

import { EarlyPoolProgress } from './EarlyPoolProgress';
import PercentTable from './PercentTable';

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
                <a href="https://app.uniswap.org/#/swap?inputCurrency=0x4eeea7b48b9c3ac8f70a9c932a8b1e8a5cb624c7&outputCurrency=0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2" target="_blank" rel="noopener noreferrer">
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
        <PercentTable early />
        <br/>
        <h6>General pool</h6>
        <PercentTable />
        <br/>
        <div><b>Example 1:</b> John has 3,450,000 MBN. He can commit 3,000,000 MBN to the Early adopters pool and get maximum rate for the rewards. He can not sell this stake. If he do – all of 3,000,000 goes to the General pool. Also, he loses his reward for the current week and other investors from Early pool share it. The remaining 450,000 MBN he has commited to the General pool. He can sell rewards or full stake amount from this pool.</div>
        <br/>
        <div><b>Example 2:</b> John has 450,000 MBN in the General pool. If he sells rewards, he loses rewards for the current week from the General pool. The remaining balance goes to the maturation period for 1 month without rewards.</div>
        <br/>
        <div><b>Example 3:</b> Alice has 1,300,000 MBN. She has committed 1,000,000 MBN in the Early adopter's pool and 300,000 MBN in the General pool. She gains rewards from the Early pool and from the General pool at the same time. She can sell rewards paid out from the General pool. It means,  if her balance drop below 1,000,000 MBN + amount of paid rewards from the Early pool, she excludes from the Early pool.</div>
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
