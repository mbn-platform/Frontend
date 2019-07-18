import React from 'react';
import SegmentedControl from '../../components/SegmentedControl';
import { Col } from 'reactstrap';
import { Desktop, Mobile } from '../../generic/MediaQuery';
import AmChartsReact from '@amcharts/amcharts3-react';
import { FormattedMessage } from 'react-intl';
import { formatDate } from '../../generic/util';
import memoizeOne from 'memoize-one';

class ProfitChart extends React.Component {

  state = {
    selectedInterval: 1,
    maximum: 0,
    minimum: 0,
    dataProvider: [],
    graphIds: [],
  }

  segments = ['ALL', 'CURRENT']

  onSegmentChange = (segment) => {
    this.setState({selectedInterval: segment});
  }

  computeState(segment) {
    let data = this.props.stats || [];
    const graphIds = [];
    const dataProvider = [];
    if (segment === 1) {
      data = data.filter((c) => c.state === 'VERIFIED');
    }
    data.forEach(({_id, points, start, sum}) => {
      graphIds.push(_id);
      dataProvider.push({
        id: _id,
        start,
        sum,
        [_id]: 0,
        date: new Date(start).getTime(),
        value: 0,
      });
      points.forEach((p) => {
        dataProvider.push({
          id: _id,
          start,
          sum,
          [_id]: p.percent,
          date: p.date,
          value: p.percent,
        });
      });
    });
    return {dataProvider, graphIds};
  }

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
                    defaultMessage="PROFITABILITY PER CONTRACT UNDER MANAGEMENT"
                  />
                </div>
                <Col className="d-flex justify-content-end">
                </Col>

              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="container d-flex flex-column profit-card-body">
              
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
                    onChange={this.onSegmentChange}
                  />
                </Desktop>
                <Mobile>
                  <SegmentedControl
                    segments={this.segments}
                    segmentWidth={50}
                    selectedIndex={this.state.selectedInterval}
                    onChange={this.onSegmentChange}
                  />
                </Mobile>
              </div>
            </div>
          </div>

        </div>
      </div>
    );

  }

  balloonFunction(graphItem) {
    const data = graphItem.dataContext;
    console.log(graphItem);
    return `<div>
    <div>Contract Start: ${formatDate(new Date(data.start))}</div>
    <div>Contract Sum: ${data.sum}</div>
    <div>Profit: ${data.value.toFixed(2)}%</div>
    </div>`;
  }

  makeConfig = memoizeOne((data, selectedInterval) => {
    const {dataProvider, graphIds } = this.computeState(selectedInterval);
    const graphs = graphIds.map((id) => {
      return {
        id: id,
        yField: id,
        xField: 'date',
        lineAlpha: 1,
        lineThickness: 2,
        lineColor: '#cfa925',
        balloonFunction: this.balloonFunction,
        bullet: 'round',
        bulletSize: 1,
        bulletAlpha: 0,
      };
    });
    let maximum = dataProvider.reduce((a, b) => a > b.value ? a : b.value, 5);
    const minimum = dataProvider.reduce((a, b) => a < b.value ? a : b.value, -5);
    console.log(dataProvider, graphIds);
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
      'chartCursor': {
        cursorColor: '#c74949',
        showBalloon: true,
        'valueLineBalloonEnabled': true,
        'valueLineEnabled': true,
        listeners: [
          // {
          // event: 'changed',
          // method: function() { console.log(arguments) },
          // },
          // {
          // event: 'moved',
          // method: function() { console.log(arguments) },
          // },
        ],
      },
      'graphs': graphs,
      'valueAxes': [{
        'id': 'ValueAxis-1',
        'title': 'Contract profit, %',
        'position': 'right',
        maximum,
        minimum,
        'axisAlpha': 0
      }, {
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
  })

  renderChart() {
    const config = this.makeConfig(this.props.stats, this.state.selectedInterval);
    if (config.graphs.length === 0) {
      return null;
    }
    console.log(config);
    return (
      <AmChartsReact.React  style={{height: '100%', width: '100%', backgroundColor: 'transparent',position: 'absolute'}}
        options={config} />
    );
  }
}

export default ProfitChart;
