import React from 'react';
import SegmentedControl from '../../components/SegmentedControl';
import { Col } from 'reactstrap';
import { Desktop, Mobile } from '../../generic/MediaQuery';
import AmChartsReact from '@amcharts/amcharts3-react';
import { FormattedMessage } from 'react-intl';

class ProfitChart extends React.Component {

  constructor(props) {
    super(props);
    this.state = {selectedInterval: 3};
  }

  segments = ['MONTH', '3 MONTH', '6 MONTH', 'YEAR']

  render() {
    return (
      <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-8 profit-block">
        <div className="card">
          <div className="card-header">
            <div className="container-fuild h-100">
              <div className="row h-100 align-items-center">
                <div className="col-auto title-text">
                  <span className="icon icon-profit icon-005-growth"/>
                  <FormattedMessage
                    id="profile.profitChart"
                    defaultMessage="PROFIT CHART"
                  />
                </div>
                <Col className="d-flex justify-content-end">
                </Col>

              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="container d-flex flex-column profit-card-body">

              <div className="row order-3 order-md-1 justify-content-center">
                <div className="col-auto profit"><div className="circle"/><div className="text">
                  <FormattedMessage
                    id="profile.profitAsTrader"
                    defaultMessage="PROFIT AS TRADER"
                  />

                </div>
                </div>
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
                    segments={this.segments}
                    selectedIndex={this.state.selectedInterval}
                    onChange={i => {
                      this.setState({selectedInterval: i});
                    }}
                  />
                </Desktop>
                <Mobile>
                  <SegmentedControl
                    segments={this.segments}
                    segmentWidth={50}
                    selectedIndex={this.state.selectedInterval}
                    onChange={i => {
                      this.setState({selectedInterval: i});
                    }}
                  />
                </Mobile>
              </div>
            </div>
          </div>

        </div>
      </div>
    );

  }

  makeConfig(selectedInterval) {
    let dataProvider = [];
    let last;
    switch (selectedInterval) {
      case 0:
        last = 86400000 * 30;
        break;
      case 1:
        last = 86400000 * 30 * 3;
        break;
      case 2:
        last = 86400000 * 30 * 6;
        break;
      case 3:
        last = 86400000 * 30 * 12;
        break;
      default:
        throw new Error();
    }
    const now = Date.now();
    this.props.stats.forEach((s) => {
      const startPoint = {
        x: new Date(s.start),
        y: s.percent,
        value: s.percent,
      };
      const endPoint = {
        x: new Date(s.end),
        y: s.percent,
        value: s.percent,
      };
      if (dataProvider.length !== 0) {
        const lastPoint = dataProvider[dataProvider.length - 1];
        if (startPoint.x.getTime() - lastPoint.x.getTime() >= 86400000) {
          dataProvider.push({
            x: lastPoint.x,
            y: 0,
            value: 0,
          });
          dataProvider.push({
            x: startPoint.x,
            y: 0,
            value: 0,
          });
        }
      }
      dataProvider.push(startPoint);
      dataProvider.push(endPoint);
    });
    const maximum = dataProvider.reduce((max, d) => Math.max(max, d.value), 0);
    const minimum = dataProvider.reduce((min, d) => Math.min(min, d.value), maximum);
    const offset = maximum !== minimum ? (maximum - minimum) * 0.1: Math.abs(maximum) * 2;
    return {
      'type': 'xy',
      'theme': 'none',
      'color': '#6f6f71',
      hideCredits: true,
      'fontFamily': 'maven_proregular',
      'marginRight': 80,
      'dataDateFormat': 'YYYY-MM-DD',
      'startDuration': 0,
      'trendLines': [],
      'balloon': {
        'adjustBorderColor': false,
        'shadowAlpha': 0,
        'fixedPosition':true
      },
      'graphs': [{
        'id': 'AmGraph-1',
        'lineAlpha': 1,
        'lineColor': '#0a87b8',
        lineThickness: 2,
        'fillAlphas': 0,
        'valueField': 'value',
        'xField': 'x',
        'yField': 'y'
      },],
      'valueAxes': [{
        'minimum': minimum - offset,
        'maximum': maximum + offset,
        'id': 'ValueAxis-1',
        'title': 'Contract profit, %',
        'position': 'right',
        'axisAlpha': 0
      }, {
        minimumDate: Date.now() - last,
        maximumDate: now,
        'id': 'ValueAxis-2',
        'axisAlpha': 1,
        'position': 'bottom',
        'type': 'date',
      }],
      listeners: [{
        event: 'rendered',
        method: function({type, chart}) {
          chart.zoomOut();
        },
      }],
      'allLabels': [],
      'titles': [],
      'dataProvider': dataProvider,
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

export default ProfitChart;
