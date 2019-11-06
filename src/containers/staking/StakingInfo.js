import React from 'react';
import { Button } from 'reactstrap';

class StakingInfo extends React.Component {

  renderInfo() {
    return (
      <div className="info">
        <h3>Staking structure</h3>
        <div>User can receive rewards for staking MBN tokens.</div>
        <br/>
        {this.renderLevelsTable()}
        <br/>
        <div><b>The reward is calculated as a:</b></div>
        <div>Personal reward = Total reward / Personal share in staking pool</div>
        <div>BTC payment comes from COF operation profit. 10% of COF profit will be distributed for users, who apply for staking level 2.</div>
        <div>Rewards are sended to users every week, on monday.
          Size of stacking rewards have a schedule, based on timeline.</div>
        <br/>
        <h5>Schedule of stacking rewards in MBN and BTC:</h5>
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
              <th />
              <th style={{width: '140px', whiteSpace: 'unset'}}>Minimum stack required</th>
              <th style={{width: '140px'}}>Timeline</th>
              <th>Token reward (MBN)</th>
              <th>Token reward (MBN)</th>
              <th style={{width: '140px', whiteSpace: 'unset'}}>COF profit reward (BTC,only Lv2)</th>
            </tr>
          </thead>
          <tbody>
            {this.stackingData.map((d, i) => {
              let className;
              const until = d[6] || 0;
              if ((now - until) > 0) {
                className = 'stale';
              } else if (now - d[5] > 0) {
                className = 'active';
              }
              return (
                <tr className={className} key={i}>
                  <td>{d[0]}</td>
                  <td>
                    <div>Lvl 1 - {i <= 1 ? '150$': '500$'}</div>
                    <div>Lvl 2 - 6000$</div>
                  </td>
                  <td>{d[1]}</td>
                  <td>{d[2]}</td>
                  <td>{d[3]}</td>
                  <td>{d[4]}</td>
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
    ['Stage 1', 'dec18’-feb19’', '0.3% daily', '9% monthly', '-'],
    ['Stage 2', 'mar19’-may19’', '0.25% daily', '7.5% monthly', '-'],
    ['Stage 3', 'june19’-aug19’', '0.2% daily', '6% monthly', '10%'],
    ['Stage 4', 'sep19’-nov19’', '0.1% daily', '3% monthly', '10%', new Date('2019-09-01'), new Date('2019-12-01')],
    ['Stage 5', 'dec19’-feb20’', '0.05% daily', '1.5% monthly', '10%', new Date('2019-12-01'), new Date('2020-03-01')],
    ['Stage 6', 'mar20’-may20’', '0.033% daily', '1% monthly', '10%', new Date('2020-03-01'), new Date('2020-06-01')],
    ['Stage 7+', 'june20’ and further', '0.016% daily', '0.5% monthly', '10%', new Date('2020-06-01'), new Date('2030-06-01')],
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
