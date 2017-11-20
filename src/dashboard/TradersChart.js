import React from 'react';
import AmCharts from 'amcharts3/amcharts/amcharts';
import PieChart from 'amcharts3/amcharts/pie';

class TradersChart extends React.Component {


  constructor(props) {
    super(props);
    this.state = {data: this.formatData(this.props.contracts.finished)};
  }

  formatData(contracts) {
    return contracts.filter(c => c.state === 'FINISHED' && c.currentBalance - c.startBalance > 0)
      .sort((c1, c2) => c1.currentBalance - c1.startBalance < c2.currentBalance - c2.startBalance)
      .map(c => ({category: c.contractor, 'column-1': c.currentBalance - c.startBalance}));
  }

  componentWillReceiveProps(nextProps) {
    this.setState({data: this.formatData(nextProps.contracts.finished)});
    if(this.chart) {
      this.chart.dataProvider = this.data;
    }
  }

  componentDidMount() {
    this.chart = window.AmCharts.makeChart('trader_pie',
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
        'autoDisplay': true,
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
          'divId': 'trader_legend',
          'rollOverColor': '#FFFFFF',
          'labelText': '',
          'align': 'left',
          'maxColumns': 1,
          'valueAlign': 'left',
          'valueText': '[[percents]] - [[title]]',
          'useMarkerColorForLabels': true,
          'useMarkerColorForValues': true,
        },
        'titles': [],
        'dataProvider': this.state.data
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
          <span className="chart_title_total_span">Total:</span> {this.state.data.reduce((sum, entry) => sum + entry['column-1'], 0)} BTC
        </div>
        <div className="charts">
          <div id="trader_pie" className="chart_pie">
          </div>
          <div className="legend_pie_wrapper">
            <div id="trader_legend" className="legend_pie">
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default TradersChart;
