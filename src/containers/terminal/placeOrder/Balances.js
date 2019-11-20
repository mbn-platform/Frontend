import BigNumber from 'bignumber.js';
import React from 'react';
import { Col, Row } from 'reactstrap';

export const Balances = ({fund, main, secondary, onMainClick, onSecondaryClick}) => {
  let value1, value2;
  if(fund) {
    const balances = fund.balances;
    value1 = balances.find(b => b.name === main);
    value1 = (value1 && value1.available) || 0;
    value1 = BigNumber(value1).toString(10);
    value2 = balances.find(b => b.name === secondary);
    value2 = (value2 && value2.available) || 0;
    value2 = BigNumber(value2).toString(10);
  } else {
    value1 = '';
    value2 = '';
  }
  return (
    <Row className="buysell__balances">
      <Col>
        Balance:
      </Col>
      <Col className="text-right" xs="auto">
        <Balance onClick={onMainClick} name={main} value={value1} fund={fund} />
        <Balance onClick={onSecondaryClick} name={secondary} value={value2} fund={fund}/>
      </Col>
    </Row>
  );
};

const Balance = ({name, value, onClick, fund}) => (
  <div>
    {value} {name} {fund && fund.contracts ? `x${fund.contracts.length}` : null}
  </div>
);
