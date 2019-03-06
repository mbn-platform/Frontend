import React from 'react';
import { Col, Row } from 'reactstrap';

export const Balances = ({fund, main, secondary, onMainClick, onSecondaryClick}) => {
  let value1, value2;
  if(fund) {
    const balances = fund.balances;
    value1 = balances.find(b => b.name === main);
    value1 = (value1 && value1.available) || 0;
    value2 = balances.find(b => b.name === secondary);
    value2 = (value2 && value2.available) || 0;
  }
  return (
    <Row className="buysell__balances">
      <Col>
        Balance:
      </Col>
      <Col className="text-right" xs="auto">
        <Balance onClick={onMainClick} name={main} value={value1} />
        <Balance onClick={onSecondaryClick} name={secondary} value={value2}/>
      </Col>
    </Row>
  );
};

const Balance = ({name, value, onClick}) => (
  <div>
    {value} {name}
  </div>
);
