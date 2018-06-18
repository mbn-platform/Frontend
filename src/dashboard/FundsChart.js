import React from 'react';
import 'amcharts3/amcharts/amcharts';
import 'amcharts3/amcharts/pie';
import 'amcharts3/amcharts/serial';
import AmChartsReact from '@amcharts/amcharts3-react';
import {getValueInBTC} from './SelectedContractChart';

class FundsChart extends React.Component {


  constructor(props) {
    super(props);
    this.state = {data: this.formatData(this.props.apiKeys)};
  }

  getValueInBTC(currencyName, currencyValue) {
    if (currencyName === 'BTC') {
      return currencyValue;
    }
    const rates = this.props.exchangesInfo['binance'] ? this.props.exchangesInfo['binance'].rates : [];
    let marketName;
    if (currencyName === 'USDT') {
      return parseFloat((currencyValue / rates['USDT-BTC']).toFixed(8));
    } else {
      marketName = `BTC-${currencyName}`;
    }
    return parseFloat((currencyValue * (rates[marketName] || 0)).toFixed(8));
  }

  formatData(apiKeys) {
    let data = {};
    for (let apiKey of apiKeys) {
      apiKey.balances.forEach(currency => {
        if (currency.available === 0){
          return;
        }
        if (!data[currency.name]) {
          data[currency.name] = currency.available;
        } else {
          data[currency.name] += currency.available;
        }
      });
    }
    const formated = Object.keys(data).map(key=>({
      category: key,
      'column-1': data[key],
      'column-2': this.getValueInBTC(key, data[key])
    })).sort((a1, a2) => a1['column-1'] < a2['column-1']);
    return formated;
  }

  componentWillReceiveProps(nextProps) {
    this.setState({data: this.formatData(nextProps.apiKeys)});
  }


  render() {
    return (
      <div className="table">
        <div className="table_title_wrapper clearfix">
          <div className="table_title center">AVAILABLE ASSETS</div>
        </div>
        <div className="charts">
          <div className="chart_pie">
            <AmChartsReact.React   style={{height: '100%', width: '100%', backgroundColor: 'transparent',position: 'absolute'}}
              options={{
                'type': 'pie',
                'fontFamily': 'maven_probold',
                'letterSpacing': '1px',
                'hideCredits': true,
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
                'allLabels': [],
                'balloon': {},
                'descriptionField': 'column-1',
                'legend': {
                  'enabled': true,
                  'marginLeft': 0,
                  'fontSize': 12,
                  'markerSize': 0,
                  'switchable': false,
                  'equalWidths': false,
                  'maxColumns': 1,
                  'textClickEnabled': true,
                  'divId': 'funds_legend',
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
            <div id="funds_legend" className="legend_pie">
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default FundsChart;
