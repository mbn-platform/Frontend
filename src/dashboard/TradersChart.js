import React from 'react';
import AmCharts from 'amcharts3/amcharts/amcharts';
import PieChart from 'amcharts3/amcharts/pie';

class TradersChart extends React.Component {

  componentDidMount() {
    console.log(window.AmCharts);
    const chart = window.AmCharts.makeChart('traders_chart',
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
        'gradientRatio': [
          -0.6,
          -0.6,
          -0.6,
          -0.6,
          0,
          0
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
        'dataProvider': [
          {
            'category': 'SATOSHI_FUNDBLUE',
            'column-1': 8
          },
          {
            'category': 'category 2',
            'column-1': 6
          },
          {
            'category': 'category 3',
            'column-1': 2
          }
        ]
      }
    );  
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
        <div id="traders_chart" style={{width: '100%', height: 205}}>
        </div>
      </div>
    );
  }
}

export default TradersChart;
