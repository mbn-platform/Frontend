import React from 'react';
import SegmentedControl from '../../components/SegmentedControl';
import { Col, Row } from 'reactstrap';
import { Desktop, Mobile } from '../../generic/MediaQuery';
import AmChartsReact from '@amcharts/amcharts3-react';
import { formatDate } from '../../generic/util';
import { ProfileBlock } from '../../components/ProfileBlock';
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
    data.forEach(({_id, points, start, sum, c}) => {
      graphIds.push(_id);
      dataProvider.push({
        c,
        id: _id,
        start,
        sum,
        [_id]: 0,
        date: new Date(start).getTime(),
        value: 0,
      });
      let lastAdded;
      points.forEach((p) => {
        if (!lastAdded || segment === 1 ||
          p.date - lastAdded.date > 86400000) {
          dataProvider.push({
            c,
            id: _id,
            start,
            sum,
            [_id]: p.percent,
            date: p.date,
            value: p.percent,
          });
          lastAdded = p;
        }
      });
      if (lastAdded && lastAdded !== points[points.length - 1]) {
        const last = points[points.length - 1];
        dataProvider.push({
          c,
          id: _id,
          start,
          sum,
          [_id]: last.percent,
          date: last.date,
          value: last.percent,
        });
      }
    });
    return {dataProvider, graphIds};
  }

  render() {
    return (
      <ProfileBlock
        iconClassName='icon-005-growth'
        title='profile.profitChart'
        className='graphic'
      >
        <Row className="justify-content-center d-flex">
          <Col xs={{size: 12, order: 2}} md="9">
            <div className="amcharts">
              {this.renderChart()}
            </div>
          </Col>
          <Col xs={{size: 12, order: 3}} md="3" className='legend'>
            {this.renderStat()}
          </Col>
          <Col xs={{order: 1}} md={{order: 3}}>
            <Desktop>
              <SegmentedControl
                segments={this.segments}
                selectedIndex={this.state.selectedInterval}
                onChange={this.onSegmentChange} />
            </Desktop>
            <Mobile>
              <SegmentedControl
                segments={this.segments}
                segmentWidth={50}
                selectedIndex={this.state.selectedInterval}
                onChange={this.onSegmentChange} />
            </Mobile>
          </Col>
        </Row>
      </ProfileBlock>
    );
  }

  renderStat() {
    const stat = this.calculateStat(this.props.stats || [], this.props.summary || {});
    if (!stat) {
      return null;
    }
    return (
      <div className="values">
        {stat.currentCount > 0 ?
          <div>Profit per current contract: {stat.currentProfit.map((v) => v.toFixed(2) + '%').join(' / ')}</div>
          : null
        }
        <div>Profit per all contracts in total: {stat.average.toFixed(2)}%</div>
        <div>Contracts with positive profit: {stat.positive}</div>
        <div>Contracts with negative profit: {stat.negative}</div>
      </div>
    );
  }

  calculateStat = memoizeOne((data, summary) => {
    const stat = {
      positive: summary.positive || 0,
      negative: summary.negative || 0,
      currentCount: 0,
      currentProfit: [],
      average: summary.avg6 || 0,
    };
    data.forEach((d) => {
      if (d.state === 'VERIFIED') {
        const lastPoint = d.points[d.points.length - 1];
        stat.currentProfit.push(lastPoint.percent);
        stat.currentCount++;
        return;
      }
    });
    return stat;
  })

  balloonFunction(graphItem) {
    const data = graphItem.dataContext;
    return `<div>
    <div>Contract starts: ${formatDate(new Date(data.start))}</div>
    <div>Contract Sum: ${data.sum} ${data.c}</div>
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
        type: 'step',
      };
    });
    let maximum = dataProvider.reduce((a, b) => a > b.value ? a : b.value, 5);
    const minimum = dataProvider.reduce((a, b) => a < b.value ? a : b.value, -5);
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
        stackType: '3d',

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
      'zoomOutOnDataUpdate': false,
      'pathToImages': 'http://cdn.amcharts.com/lib/3/images/',
      'zoomOutText': 'Zoom out',
      'zoomOutButtonAlpha': 0,
      'zoomOutButtonColor': '#fff',
      'zoomOutButtonImage': 'lensWhite',
      'zoomOutButtonRollOverAlpha': 0.1,
    };
  })

  renderChart() {
    const config = this.makeConfig(this.props.stats, this.state.selectedInterval);
    if (config.graphs.length === 0) {
      return null;
    }
    return (
      <AmChartsReact.React  style={{height: '100%', width: '100%', backgroundColor: 'transparent',position: 'absolute'}}
        options={config} />
    );
  }
}

export default ProfitChart;
