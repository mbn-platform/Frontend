import React from 'react';

class ContractsChart extends React.Component {

  constructor(props) {
    super(props);
    this.state = {data: this.formatData(props.contracts)};
  }

  formatData(contracts) {
    const data = contracts.reduce((acc, c) => {
      acc[c.contractor] = acc[c.contractor] || 0;
      acc[c.contractor] += c.currentBalance - c.startBalance
      return acc;
    }, {});
    return Object.entries(data).filter(a => a[1] > 0)
      .sort((a1, a2) => a1[1] < a2[1])
      .map(a => ({
        category: a[0],
        'column-1': a[1]
      }));
  }

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

  componentDidMount() {
    this.chart = window.AmCharts.makeChart('contracts_chart',
      {
        'type': 'pie',
        'fontFamily': 'maven_probold',
        'letterSpacing': '1px',
        'colors': [
          '#6c6c6e',
          '#dcb049',
          '#c94546',
          '#ce802c',
          '#c5c5c5',
          '#465666'
        ],
        'balloonText': '[[title]]<br><span style=\'font-size:14px\'><b>[[value]]</b> ([[percents]]%)</span>',
        'innerRadius': '70%',
        'labelsEnabled': false,
        'startDuration': 0,
        'titleField': 'category',
        'valueField': 'column-1',
        'allLabels': [],
        'balloon': {},
        'legend': {
          'enabled': true,
          'align': 'center',
          'fontSize': 12,
          'markerSize': 0,
          'position': 'right',
          'switchable': false,
          'textClickEnabled': true,
          'rollOverColor': '#FFFFFF',
          'labelText': '',
          'valueAlign': 'left',
          'valueText': '[[percents]] - [[title]]',
          'useMarkerColorForLabels': true,
          'useMarkerColorForValues': true,
          'valueWidth': 200
        },
        'titles': [],
        'dataProvider': this.state.data
      }
    );
  }
}

export default ContractsChart;
