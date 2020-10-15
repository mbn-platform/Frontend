import React from 'react';
export const NegativeValuesCell = ({ value }) => (
  <div className={value < 0 ? 'table_value_red' : 'table_value_green'}>
    {(value * 100).toFixed(2)}
  </div>
);

export const ContractTableHeader = (header) => (
  <div className="table_header_wrapper contract_header_wrapper">
    <div className="table_header">
      {header}
    </div>
    <div className="sort_icon_wrapper">
      <div className="green_arrow"/>
    </div>
  </div>
);
