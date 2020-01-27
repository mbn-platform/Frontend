import React from 'react';
import { Col, Row } from 'reactstrap';

import PercentTable from './PercentTable';

const Rules = () => (
  <div className="info">
    <h3>Rules of Staking</h3>
    <Row>
      <Col xs="12" md="8">
        <br />
        <div>1) Staking - the network incentivization mechanism for users, based on their conditional tokens holding.</div>
        <br />
        <div>2) Pool - the group of staking programs, characterized by the interest rate percent and necessary conditions for accrual of rewards.</div>
        <br />
        <div>3) Maturation - the "growing" period in staking, during which the investor does not receive a reward.</div>
        <br />
        <div>4) Rewards - weekly payments in MBN, which are accrued to the address used in staking program.</div>
        <br />
        <div>5) Early Adopters Pool - A limited staking program for early participants, where the total amount of tokens that are eligible for activation is capped at 50,000,000 MBN.</div>
        <br />
        <div>5.1) Maturation period is not applied for users, who started to stake before Jan 1, 2020.</div>
        <br />
        <div>5.2) To activate this program, you must commit the initial number of tokens (at least 100,000 MBN).</div>
        <br />
        <div>5.3) Rewards are capitalized every week and participate in staking. Thus, each subsequent reward is greater than the previous one, granted that no tokens are withdrawn.</div>
        <br />
        <div>5.4) If investor withdraws tokens from the Early Adopters Pool, then he loses his allocation in it and all remaining tokens will go to the General Pool. Updated amount of tokens belonging to the Early Adopters Pool will be calculated according to the formula: Early Adopters Pool size = Initial token commit + Early Adopters Pool rewards.</div>
        <br />
        <div>5.5) If amount of withdrawal is greater than value = (Initial Balance + Early Adopter Pool), then investor wont be rewarded for the final staking week and tokens will be re-distributed between other Early Adopter Pool participants.</div>
        <br />
        <div>5.6) Rewards are calculated according to table:</div>
        <PercentTable early />
        <br />
        <div>6) General Pool - the main program of token holding.</div>
        <br />
        <div>6.1) Maturation period = 1 month</div>
        <br />
        <div>6.2) Minimum amount of tokens required for participation in the General Pool = 100,000 MBN</div>
        <br />
        <div>6.3) Rewards are capitalized every week and participate in staking. Thus, each subsequent reward is greater than the previous one, granted that no tokens are withdrawn.</div>
        <br />
        <div>6.4) If investor withdraws tokens from the General Pool, then he will loses his accrue for final week of staking and maturation will be applied, after which rewards distribution will be continued (if conditions are complied with p6.2)</div>
        <br />
        <div>6.5) Amount of tokens belonging to the General Pool is calculated by formula: General Pool size = Total amount of tokens on address - Early Adopters Pools tokens</div>
        <br />
        <div>6.6) Rewards are calculated according to table:</div>
        <PercentTable />
        <br />
      </Col>
    </Row>
  </div>
);

export default Rules;
