import React from 'react';
import AmCharts from 'amcharts3/amcharts/amcharts';
import PieChart from 'amcharts3/amcharts/pie';
import SerialChar from 'amcharts3/amcharts/serial';
import AmChartsReact from "@amcharts/amcharts3-react";

class SelectedContractChart extends React.Component {

  constructor(props) {
    super(props);
    this.getValueInBTC = getValueInBTC.bind(this);
    this.state = {data: this.formatData(props.contract ? props.contract.balances : [])};
  }

  formatData(balances) {
    const data = balances.filter(balance => balance.available > 0)
      .sort((a1, a2) => a1.available < a2.available)
      .map(a => ({
        category: a.name,
        'column-1': a.available,
        'column-2': this.getValueInBTC(a.name, a.available)
      }));
    return data;
  }

  componentWillReceiveProps(nextProps) {
    this.setState({data: this.formatData(nextProps.contract ? nextProps.contract.balances : [])});
  }

  render() {
    return (
      <div className="table">
        <div className="table_title_wrapper clearfix">
          <div className="table_title center">CONTRACT CURRENCIES</div>
        </div>
        <div className="charts">
          <div className="chart_pie">
            <AmChartsReact.React   style={{height: '100%', width: '100%', backgroundColor: 'transparent',position: 'absolute'}}
                         options={{
                          'type': 'pie',
                          'fontFamily': 'maven_probold',
                          'letterSpacing': '1px',
                          "hideCredits": true,
                          'colors': [
                            '#6c6c6e',
                            '#dcb049',
                            '#c94546',
                            '#ce802c',
                            '#c5c5c5',
                            '#465666'
                          ],
                          'balloonText': '[[title]]<br><span style=\'font-size:14px\'><b>[[description]]</b> ([[percents]]%)</span>',
                          'innerRadius': '70%',
                          'labelsEnabled': false,
                          'startDuration': 0,
                          'titleField': 'category',
                          'valueField': 'column-2',
                           'descriptionField': 'column-1',
                          'allLabels': [],
                          'balloon': {},
                          'legend': {
                            'enabled': true,
                            'marginLeft': 0,
                            'fontSize': 12,
                            'markerSize': 0,
                            'switchable': false,
                            "equalWidths": false,
                            'maxColumns': 1,
                            'textClickEnabled': true,
                            'divId': 'contracts_legend',
                            'rollOverColor': '#FFFFFF',
                            'labelText': '',
                            'valueAlign': 'left',
                            'align': 'left',
                            'valueText': '[[description]] [[title]]',
                            'useMarkerColorForLabels': true,
                            'useMarkerColorForValues': true
                          },
                          'titles': [],
                          'dataProvider': this.state.data
                        }} />          
          </div>
          <div className="legend_pie_wrapper">
            <div id="contracts_legend" className="legend_pie">
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SelectedContractChart;

export function getValueInBTC(currencyName, currencyValue) {
  if (currencyName === 'BTC') {
    return currencyValue;
  }
  const rates = this.props.exchangesInfo['binance'] ? this.props.exchangesInfo['binance'].rates : [];
  let marketName;
  if (currencyName === 'USDT') {
    return (currencyValue / rates['USDT-BTC']).toFixed(8);
  } else {
    marketName = `BTC-${currencyName}`;
  }
  return (currencyValue * (rates[marketName] || 0)).toFixed(8);
}
