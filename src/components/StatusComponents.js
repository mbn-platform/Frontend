import React from 'react';
import classNames from 'classnames';
import { UncontrolledTooltip } from 'reactstrap';

const STATUS_HELP = 'Selected key pairs allowed for trading';

export const StatusCell = (onClick, changedCurrencies) => rowInfo => {
  let selected;
  if(changedCurrencies[rowInfo.original.name]) {
    selected = !rowInfo.value;
  } else {
    selected = rowInfo.value;
  }
  const className = classNames('currency_status_checkbox', {selected});
  return (<div data-currency={rowInfo.original.name} data-selected={rowInfo.value} onClick={onClick} className={className}/>);
};

export const StatusHeader = (onSelectAllClicked, selectedAll) => {
  return (
    <div className="table_header_wrapper">
      <span className="table_header">Status</span>
      <div id="help-icon-enabled-currencies" className="table_header_help_wrapper" style={{marginLeft: 0}}></div>
      <UncontrolledTooltip target="help-icon-enabled-currencies" placement="right">
        {STATUS_HELP}
      </UncontrolledTooltip>
      <div className="sort_icon_wrapper">
        <div className="green_arrow green_arrow_bottom" ></div>
      </div>
      <div className="title_green_arrows_wrapper">
        <div onClick={onSelectAllClicked} className="currency_select_all">All</div>
        <div onClick={onSelectAllClicked} className={classNames('currency_status_checkbox', {selected: selectedAll})}></div>
      </div>

    </div>
  );
};
