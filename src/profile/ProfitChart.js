import React from 'react';
import SegmentedControl from '../generic/SegmentedControl';
import { Col } from 'reactstrap';
import { Desktop, Mobile } from '../generic/MediaQuery';
import AmChartsReact from '@amcharts/amcharts3-react';

class ProfitChart extends React.Component {

  constructor(props) {
    super(props);
    const trades = [].concat.apply([], props.trades);
    const tradesAsInvestor = [].concat.apply([], props.tradesAsInvestor);
    const profit = calculateAllProfit(trades);
    const profitAsInvestor = calculateAllProfit(tradesAsInvestor);
    this.state = {selectedCurrency: 0, selectedInterval: 2, profit, profitAsInvestor};
  }

  componentWillReceiveProps(nextProps) {
    const trades = [].concat.apply([], nextProps.trades);
    const profit = calculateAllProfit(trades);
    const tradesAsInvestor = [].concat.apply([], nextProps.tradesAsInvestor);
    const profitAsInvestor = calculateAllProfit(tradesAsInvestor);
    this.setState({trades, profit, profitAsInvestor});
  }
  formatData(selectedInterval) {
    let data = this.state.profit;
    let dataAsInvestor = this.state.profitAsInvestor;
    let now = Date.now();
    const isUsd = this.state.selectedCurrency === 0;
    switch(selectedInterval) {
      case 0:
        data = data.filter(p => now - new Date(p[0]) < 86400000);
        dataAsInvestor = dataAsInvestor.filter(p => now - new Date(p[0]) < 86400000);
        if(isUsd) {
          data = data.map(p => [p[0], p[2]]);
          data = dataAsInvestor.map(p => [p[0], p[2]]);
        }
        break;
      case 1:
        data = data.filter(p => now - new Date(p[0]) < 86400000 * 7);
        data = normalize(data, 8640000, isUsd);
        dataAsInvestor = dataAsInvestor.filter(p => now - new Date(p[0]) < 86400000 * 7);
        dataAsInvestor = normalize(dataAsInvestor, 8640000, isUsd);
        break;
      case 2:
        data = data.filter(p => now - new Date(p[0]) < 86400000 * 30);
        data = normalize(data, 86400000, isUsd);
        dataAsInvestor = dataAsInvestor.filter(p => now - new Date(p[0]) < 86400000 * 30);
        dataAsInvestor = normalize(dataAsInvestor, 86400000, isUsd);
        break;
      case 3:
        data = data.filter(p => now - new Date(p[0]) < 86400000 * 180);
        data = normalize(data, 86400000 * 12, isUsd);
        dataAsInvestor = dataAsInvestor.filter(p => now - new Date(p[0]) < 86400000 * 180);
        dataAsInvestor = normalize(dataAsInvestor, 86400000 * 12, isUsd);
        break;
      case 4:
        data = data.filter(p => now - new Date(p[0]) < 86400000 * 360);
        data = normalize(data, 86400000 * 24, isUsd);
        dataAsInvestor = dataAsInvestor.filter(p => now - new Date(p[0]) < 86400000 * 360);
        dataAsInvestor = normalize(dataAsInvestor, 86400000 * 24, isUsd);
        break;
      case 5:
        data = normalize(data, 86400000 * 24, isUsd);
        dataAsInvestor = normalize(dataAsInvestor, 86400000 * 24, isUsd);
        break;
      default:
        break;
    }
    const shared = dataAsInvestor.map(p => ({
      category: p[0],
      investor_profit: p[1],
    })).concat(data.map(p => ({
      category: p[0],
      'column-1': p[1],
    })));
    shared.sort((p1, p2) => p1.category - p2.category);
    return shared;
  }

  render() {
    return (
      <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-8 profit-block">
        <div className="card">
          <div className="card-header">
            <div className="container-fuild h-100">
              <div className="row h-100 align-items-center">
                <div className="col-auto title-text">
                  <span className="icon icon-profit icon-005-growth"></span>PROFIT CHART
                </div>
                <Col className="d-flex justify-content-end">
                  <Desktop>
                    <SegmentedControl
                      className="currency-button"
                      segments={['USD', 'BTC']}
                      selectedIndex={this.state.selectedCurrency}
                      onChange={i => this.setState({selectedCurrency: i})}
                    />
                  </Desktop>
                  <Mobile>
                    <SegmentedControl
                      className="currency-button"
                      segments={['USD', 'BTC']}
                      segmentWidth={50}
                      selectedIndex={this.state.selectedCurrency}
                      onChange={i => this.setState({selectedCurrency: i})}
                    />
                  </Mobile>

                </Col>

              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="container d-flex flex-column profit-card-body">

              <div className="row order-3 order-md-1 justify-content-center">
                <div className="col-auto profit"><div className="circle"></div><div className="text">PROFIT AS TRADER</div></div>
                <div className="col-auto profit"><div className="circle green"></div><div className="text">PROFIT AS INVESTOR</div></div>
              </div>
              <div className="row order-2 justify-content-center amcharts-block">
                <div className="col-12">
                  <div className="amcharts">
                    {this.renderChart()}
                  </div>

                </div>

              </div>
              <div className="row order-1 order-md-3 justify-content-center">
                <Desktop>
                  <SegmentedControl
                    segments={['DAY', 'WEEK', 'MONTH', '6 MONTH', 'YEAR', 'ALL']}
                    selectedIndex={this.state.selectedInterval}
                    onChange={i => {
                      this.setState({selectedInterval: i});
                    }}
                  />
                </Desktop>
                <Mobile>
                  <SegmentedControl
                    segments={['DAY', 'WEEK', 'MONTH', '6 MONTH', 'YEAR', 'ALL']}
                    segmentWidth={50}
                    selectedIndex={this.state.selectedInterval}
                    onChange={i => {
                      this.setState({selectedInterval: i});
                    }}
                  />
                </Mobile>
              </div>
              <div className="row order-4 d-flex d-md-none justify-content-center ">
                <div className="container-fuild alltime-block">
                  <div className="row justify-content-center">
                    <div className="col-auto">
                      <div className="graphic-fake"></div>
                    </div>
                    <div className="col-auto">
                      <div className="d-flex flex-column">
                        <div className="alltime">alltime</div>
                        <div className="percent">634.6%</div>
                        <div className="date">Since Sep 16th, 2016</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    );

  }

  makeConfig(selectedInterval) {
    return {
      'type': 'serial',
      'categoryField': 'category',
      'startDuration': 0,
      'fontSize': 10,
      'color': '#6f6f71',
      'fontFamily': 'maven_proregular',
      'trendLines': [],
      'colors': [
        '#0a87b8',
        '#32ba94',
      ],
      'categoryAxis': {
        'equalSpacing': true,
        'gridPosition': 'start',
        'minPeriod': 'hh',
        'parseDates': true
      },
      'graphs': [
        {
          'balloonText': '[[title]] of [[category]]:[[value]]',
          'id': 'AmGraph-1',
          'lineAlpha': 1,
          'lineThickness': 2,
          'visibleInLegend': false,
          'type': 'smoothedLine',
          'valueField': 'column-1'
        },
        {
          'balloonText': '[[title]] of [[category]]:[[value]]',
          'id': 'investor_profit',
          'lineAlpha': 1,
          'lineThickness': 2,
          'visibleInLegend': false,
          'type': 'smoothedLine',
          'valueField': 'investor_profit'
        },
      ],
      'guides': [],
      'valueAxes': [
        {
          'title': this.state.selectedCurrency ? 'BTC' : 'USD',
          'id': 'ValueAxis-1',
          'position': 'right',
        }
      ],
      'allLabels': [],
      'balloon': {},
      'legend': {
        'enabled': true,
        'useGraphSettings': true
      },
      'titles': [
      ],
      'dataProvider': this.formatData(selectedInterval)
    };
  }

  renderChart() {
    const config = this.makeConfig(this.state.selectedInterval);
    return (
      <AmChartsReact.React  style={{height: '100%', width: '100%', backgroundColor: 'transparent',position: 'absolute'}}
        options={config} />
    );
  }
}

function calculateAllProfit(trades) {
  let profit = [];
  const buys = {};

  for(let trade of trades) {
    if(trade.type === 'Buy') {
      let info = buys[trade.amountCurrency];
      if(!info) {
        info = {amount: trade.amount, price: trade.price};
        buys[trade.amountCurrency] = info;
      } else {
        let price = (info.amount * info.price + trade.amount * trade.price) /
          (info.amount + trade.amount);
        price = parseFloat(price.toFixed(8));
        info.amount += trade.amount;
        info.price = price;
      }
    } else {
      const info = buys[trade.amountCurrency];
      if(!info) {
        continue;
      } else if(info.amount < trade.amount) {
        continue;
      };
      const plus = parseFloat(((trade.price - info.price) * trade.amount).toFixed(8));
      const plusInUsd = parseFloat((trade.usdtToBtcRate * plus).toFixed(2));
      profit.push([new Date(trade.date).getTime(), plus, plusInUsd]);

      info.amount -= trade.amount;
    }
  }
  return profit;
};

function normalize(profit, interval, isUsd) {
  console.log(profit);
  const plusIndex = isUsd ? 2 : 1;
  const normalized = [];
  let cur;
  let curMax;
  let curMin;
  for(let i = profit.length - 1; i >= 0; i--) {
    let p = profit[i];
    if(!curMax) {
      curMax = p[0];
      curMin = p[0];
      cur = p[plusIndex];
      continue;
    }
    if(curMax - p[0] < interval) {
      curMin = p[0];
      cur += p[plusIndex];
    } else {
      normalized.unshift([(curMax + curMin) / 2, cur]);
      curMax = p[0];
      cur = p[plusIndex];
    }
  }
  normalized.unshift([(curMax + curMin) / 2, cur]);
  return normalized;
}


export default ProfitChart;
