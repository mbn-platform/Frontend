import React from 'react';
import AmChartsReact from '@amcharts/amcharts3-react';
import { Col } from 'reactstrap';
import SegmentedControl from '../../components/SegmentedControl';
import { Desktop, Mobile } from '../../generic/MediaQuery';
import { FormattedMessage } from 'react-intl';
import memoizeOne from 'memoize-one';


class BalanceChart extends React.PureComponent {
  state = {
    data: [],
    selected: ['USDT', 'BTC'],
    selectedInterval: 1,
    end: Date.now(),
    start: Date.now() - 86400 * 7 * 1000
  }

  onZoom = (item) => {
    console.log(item);
    const {start: selectedStart, end: selectedEnd} = item;
    this.setState({selectedStart, selectedEnd});
  }

  onZoomOut = (item) => {
    console.log(item.startIndex, item.endIndex);
    console.log(item.chart.dataProvider);
    this.setState({
      startItem: item.chart.dataProvider[item.startIndex],
      endItem: item.chart.dataProvider[item.endIndex],
    });
  }

  segments = ['ALL', 'CURRENT']

  onSegmentChange = (segment) => {
    this.setState({selectedInterval: segment});
  }

  componentDidUpdate(prevProps) {
    if (this.props.name && this.props.name !== prevProps.name) {
      window.fetch(`/api/v2/profile/${this.props.name}/balanceStat?start=${this.state.start}&end=${this.state.end}`)
        .then(res => res.json())
        .then(data => this.setState({data}));
    }
  }

  toggle = (graphId) => {
    if (this.state.selected.includes(graphId)) {
      this.setState({selected: this.state.selected.filter((id) => id !== graphId)});
    } else {
      this.setState({selected: [...this.state.selected, graphId]});
    }
  }

  render() {
    return (
      <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-8 graphic">
        <div className="card">
          <div className="card-header">
            <div className="container-fuild h-100">
              <div className="row h-100 align-items-center">
                <div className="col-auto title-text">
                  <span className="icon icon-profit icon-005-growth"/>
                  <FormattedMessage
                    id="profile.balanceChart"
                    defaultMessage="Assets under management"
                  />
                </div>
                <Col className="d-flex justify-content-end">
                </Col>

              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="container d-flex flex-column graphic-card-body">
              <div className="row order-2 justify-content-center amcharts-block">
                <Col xs="12" md="9">
                  <div className="amcharts">
                    {this.renderChart()}
                  </div>
                </Col>
                <Col xs="12" md="3" className='legend'>
                  <div className='graphs'>
                    <span className='usdt' onClick={() => this.toggle('USDT')}>USDT</span> / <span
                      className='btc' onClick={() => this.toggle('BTC')}>BTC</span>
                  </div>
                  {this.renderCurrent()}
                  {this.renderChange()}
                </Col>
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

  renderChange() {
    console.log('rendering change');
    console.log(this.state);
    const {startItem: first, endItem: latest} = this.state;
    console.log(first, latest);
    if (!latest) {
      return null;
    } else {
      const btcLast = latest.btc;
      const btcFirst = first.btc;
      const usdtLast = latest.usdt;
      const usdtFirst = first.usdt;
      let btcChange;
      if (btcFirst === 0 && btcLast === 0) {
        btcChange = 0;
      } else if (btcFirst === 0) {
        btcChange = 100;
      } else {
        btcChange = (((btcLast / btcFirst) || 0) - 1) * 100;
      }
      let usdtChange;
      if (usdtFirst === 0 && usdtLast === 0) {
        usdtChange = 0;
      } else if (usdtFirst === 0) {
        usdtChange = 100;
      } else {
        usdtChange = (((usdtLast / usdtFirst) || 0) - 1) * 100;
      }
      return (
        <div className='values'>Change: <span
          className='usdt'>{usdtChange.toFixed(2)}%</span> / <span className='btc'
        >{btcChange.toFixed(2)}%</span></div>
      );
    }
  }

  renderCurrent() {
    const {endItem} = this.state;
    if (!endItem) {
      return null;
    } else {
      const btc = endItem.btc;
      const usdt = endItem.usdt;
      return (
        <div className='values'>Current: <span
          className='usdt'>{usdt.toFixed(2)}</span> / <span className='btc'
        >{btc.toFixed(6)}</span></div>
      );
    }
  }

  graphBalloon() {
    return '';
  }

  calculateDataProvider(segment) {
  }

  getConfig = memoizeOne((data, selectedInterval, selected) => {
    const {
      dataProvider,
      graphs,
    } = this.formatData(data, selectedInterval, selected);
    const config = {
      type: 'serial',
      color: '#6f6f71',
      fontFamily: 'maven_proregular',
      marginRight: 80,
      hideCredits: true,
      dataDateFormat: 'YYYY-MM-DD',
      synchronizeGrid: false,
      'chartCursor': {
        cursorColor: '#c74949',
        showBalloon: true,
        'valueLineBalloonEnabled': true,
        'valueLineEnabled': true,
        listeners: [
          // {
          // event: 'zoomed',
          // method: this.onZoom,
          // },
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
      'balloon': {
      },
      valueAxes: [
        {
          id: 'usdt',
          // minimum: minUSDT,
          // maximum: maxUSDT,
          title: 'Total balance, USDT',
          position: 'right',
          axisAlpha: 0
        },
        {
          id: 'btc',
          // minimum: minUSDT,
          // maximum: maxUSDT,
          title: 'Total balance, BTC',
          position: 'left',
          axisAlpha: 0
        },
        // {
        // id: 'btc',
        // minimum: minBTC,
        // maximum: maxBTC,
        // title: 'Total balance, BTC',
        // position: 'left',
        // gridAlpha: 0,
        // axisAlpha: 0
        // },
      ],
      graphs,
      listeners: [
        {
          event: 'rendered',
          method: function({type, chart}) {
            chart.zoomOut();
          },
        },
        {
          event: 'zoomed',
          method: this.onZoomOut,
        },
      ],
      categoryField: 'date',
      categoryAxis: {
        minPeriod: '30mm',

        parseDates: true,
      },
      dataProvider,
    };
    return config;
  })

  formatData = (data, selectedInterval, selected) => {
    data.sort((d1, d2) => d1.date - d2.date);
    if (selectedInterval === 1) {
      console.log(data);
      const points = [];
      for (let i = data.length - 1; i >= 0; i--) {
        const stat = data[i];
        const usdt = parseFloat(
          (stat.ownBalance.USDT + stat.contractBalance.USDT).toFixed(2),
        );
        const btc = parseFloat(
          (stat.ownBalance.BTC + stat.contractBalance.BTC).toFixed(8),
        );
        if (usdt === 0) {
          break;
        }
        points.push({
          date: new Date(stat.date),
          usdt: usdt,
          btc: btc,
        });
      }
      
      points.reverse();
      if (points.length === 0) {
        return {dataProvider: points, graphs: []};
      }
      const graphs = [
        {
          lineColor: '#32ba94',
          lineThickness: 2,
          valueAxis: 'btc',
          bullet: 'round',
          bulletSize: 1,
          bulletAlpha: 0,
          hidden: !selected.includes('BTC'),
          valueField: 'btc',
        },
        {
          lineColor: '#0a87b8',
          lineThickness: 2,
          valueAxis: 'usdt',
          bullet: 'round',
          bulletSize: 1,
          bulletAlpha: 0,
          hidden: !selected.includes('USDT'),
          valueField: 'usdt',
        },
      ];
      return {dataProvider: points, graphs};
    }
    const groups = [];

    let activeGroup = 0;
    let i = 0;
    while (i < data.length) {
      const group = {
        btcId: activeGroup + 'btc',
        usdtId: activeGroup + 'usdt',
        data: [],
      };
      for (i; i < data.length; i++) {
        const stat = data[i];
        const usdt = parseFloat(
          (stat.ownBalance.USDT + stat.contractBalance.USDT).toFixed(2),
        );
        const btc = parseFloat(
          (stat.ownBalance.BTC + stat.contractBalance.BTC).toFixed(8),
        );
        if (usdt === 0) {
          if (group.length === 0) {
            continue;
          } else {
            activeGroup++;
            i++;
            break;
          }
        } else {
          group.data.push({
            date: new Date(stat.date),
            [activeGroup + 'usdt']: usdt,
            [activeGroup + 'btc']: btc,
            usdt,
            btc,
          });
        }
      }
      if (group.data.length > 0) {
        groups.push(group);
      }
    }

    const graphs = [];
    groups.forEach((g) => {
      graphs.push({
        lineColor: '#32ba94',
        lineThickness: 2,
        valueAxis: 'btc',
        bullet: 'round',
        bulletSize: 1,
        bulletAlpha: 0,
        hidden: !selected.includes('BTC'),
        id: g.btcId,
        valueField: g.btcId,
      });
      graphs.push({
        lineColor: '#0a87b8',
        lineThickness: 2,
        valueAxis: 'usdt',
        bullet: 'round',
        bulletSize: 1,
        bulletAlpha: 0,
        hidden: !selected.includes('USDT'),
        valueField: g.usdtId,
        id: g.usdtId,
      });
    });
    console.log(groups);
    const points = groups.reduce((a, g) => a.concat(g.data), []);
    return {dataProvider: points, graphs};

  }

  renderChart() {
    console.log('rendering chart');
    const config = this.getConfig(this.state.data, this.state.selectedInterval, this.state.selected);
    return (
      <AmChartsReact.React style={{height: '100%', width: '100%', backgroundColor: 'transparent',position: 'absolute'}}
        options={config} />
    );
  }
}


export default BalanceChart;
