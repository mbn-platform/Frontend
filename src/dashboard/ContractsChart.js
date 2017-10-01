import React from 'react';

class ContractsChart extends React.Component {
  render() {
    return (
      <div className="table">
        <div className="table_title_wrapper clearfix">
          <div className="table_title center">Profit as trader</div>
        </div>
        <div className="chart_title_total">
          <span className="chart_title_total_span">Total:</span> 1.456 btc ~ 24 865 usd
        </div>
        <div id="contracts_chart">
        </div>
      </div>
    );
  }
}

export default ContractsChart;
