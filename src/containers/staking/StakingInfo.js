import React from 'react';
import { Button } from 'reactstrap';
import { Col, Row } from 'reactstrap';

class StakingInfo extends React.Component {

  renderInfo() {
    const style = {
      width: 240,
      height: '20',
      fontSize: '11px',
    };
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
        <h5>Schedule of stacking rewards in MBN and ETH:</h5>
        <br/>
        {this.renderTable()}
        <br/>
        <div><b>Example:</b> User has bought 100000 MBN on IDEX. He bought  200000 MBN more to have Level 2 staking reward. By staking it, he receives 4500 MBN as the reward each month during stage 3, part of COF profits (total of 10%).</div>
      </div>
    );
  }

  renderTable() {
    const now = Date.now();
    return (
      <div style={{overflowX: 'auto'}}>
        <table>
          <thead>
            <tr>
              <th style={{width: '140px'}}>Timeline</th>
              <th>daily</th>
              <th>monthly</th>
              <th>annually</th>
              <th style={{width: '140px', whiteSpace: 'unset'}}>COF profit reward (BTC,only Lv2)</th>
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
    ['dec19’-nov20’', [0.05, 0.05, 0.066, 0.1], [1.5, 1.5, 2, 3], [20, 20, 27, 43], [10, 10, 10, 15], new Date('2019-12-01'), new Date('2020-12-01')],
    ['dec20’-nov21’', [0.033, 0.033, 0.05, 0.066], [1, 1, 1.5, 2], [13, 13, 20, 27], [10, 10, 10, 15], new Date('2020-12-01'), new Date('2021-12-01')],
  ]


  render() {
    return (
      <div>
        {this.renderInfo()}
        <Button onClick={this.props.verifyStakeAddress}>Start</Button>
      </div>
    );
  }
}
export default StakingInfo;
