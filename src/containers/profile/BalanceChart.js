import React from 'react';
import AmChartsReact from '@amcharts/amcharts3-react';
import { Col } from 'reactstrap';
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
      // this.setState({data: getBalanceStat()});
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
            </div>
          </div>

        </div>
      </div>
    );
  }

  renderChange() {
    const {startItem: first, endItem: latest} = this.state;
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

function getBalanceStat() {
  return [{'date':1563525000000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.66014602,'BTC':0.00199475,'ETH':0.0942869}},{'date':1563526800000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.56309811,'BTC':0.00198703,'ETH':0.09427424}},{'date':1563528600000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.58078073,'BTC':0.001994,'ETH':0.09425592}},{'date':1563530400000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.50750756,'BTC':0.00198253,'ETH':0.09424406}},{'date':1563532200000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.39067318,'BTC':0.001985,'ETH':0.09423984}},{'date':1563534000000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.53200509,'BTC':0.00198922,'ETH':0.09424836}},{'date':1563535800000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.52729403,'BTC':0.00198739,'ETH':0.09422673}},{'date':1563537600000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.39726867,'BTC':0.00198366,'ETH':0.09427467}},{'date':1563539400000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.63835583,'BTC':0.00196845,'ETH':0.0942692}},{'date':1563541200000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.65920381,'BTC':0.00197229,'ETH':0.09429121}},{'date':1563543000000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.35204246,'BTC':0.00197748,'ETH':0.09428353}},{'date':1563544800000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.37088671,'BTC':0.00197694,'ETH':0.09432713}},{'date':1563546600000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.4321099,'BTC':0.0019805,'ETH':0.09428754}},{'date':1563548400000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.4660502,'BTC':0.00198207,'ETH':0.09423109}},{'date':1563550200000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.57720417,'BTC':0.00198281,'ETH':0.09430001}},{'date':1563552000000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.6139776,'BTC':0.00198014,'ETH':0.09417075}},{'date':1563553800000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.47924118,'BTC':0.00198243,'ETH':0.09424409}},{'date':1563555600000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.57714962,'BTC':0.00198485,'ETH':0.09423929}},{'date':1563557400000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.5920612,'BTC':0.00198182,'ETH':0.09425578}},{'date':1563559200000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.55744483,'BTC':0.00197413,'ETH':0.09426129}},{'date':1563561000000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.5772313,'BTC':0.00198172,'ETH':0.09424398}},{'date':1563562800000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.56875139,'BTC':0.00198144,'ETH':0.09427423}},{'date':1563564600000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.61018012,'BTC':0.00198277,'ETH':0.09426537}},{'date':1563566400000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.59701777,'BTC':0.00198201,'ETH':0.09424827}},{'date':1563568200000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.68652798,'BTC':0.00197776,'ETH':0.09428682}},{'date':1563570000000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.73834968,'BTC':0.00197361,'ETH':0.09425237}},{'date':1563571800000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.717621,'BTC':0.00197571,'ETH':0.09423526}},{'date':1563573600000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.83445538,'BTC':0.00197559,'ETH':0.09429489}},{'date':1563575400000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.83159053,'BTC':0.00197693,'ETH':0.09425633}},{'date':1563577200000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.71664557,'BTC':0.00197962,'ETH':0.09425654}},{'date':1563579000000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.82314883,'BTC':0.00197635,'ETH':0.09425225}},{'date':1563580800000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.81090006,'BTC':0.00198118,'ETH':0.09428215}},{'date':1563582600000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.92019674,'BTC':0.00198565,'ETH':0.09427759}},{'date':1563584400000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.84006964,'BTC':0.00199429,'ETH':0.09421796}},{'date':1563586200000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.850473,'BTC':0.00199725,'ETH':0.09423091}},{'date':1563588000000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.80995785,'BTC':0.00199461,'ETH':0.09426507}},{'date':1563589800000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.93621436,'BTC':0.00200025,'ETH':0.09428604}},{'date':1563591600000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':21.20945605,'BTC':0.00201939,'ETH':0.09428101}},{'date':1563593400000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':21.38941869,'BTC':0.00203513,'ETH':0.09428466}},{'date':1563595200000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':21.36209452,'BTC':0.00203303,'ETH':0.09424315}},{'date':1563597000000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':21.34790113,'BTC':0.00203371,'ETH':0.09425538}},{'date':1563598800000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':21.45160473,'BTC':0.00202305,'ETH':0.09425134}},{'date':1563600600000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':21.4497211,'BTC':0.00202244,'ETH':0.09425135}},{'date':1563602400000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':21.36680558,'BTC':0.00202049,'ETH':0.09425562}},{'date':1563604200000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':21.39318754,'BTC':0.00201852,'ETH':0.09424727}},{'date':1563606000000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':21.36397894,'BTC':0.00201585,'ETH':0.09427226}},{'date':1563607800000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':21.34513469,'BTC':0.00202288,'ETH':0.09426814}},{'date':1563609600000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':21.27729537,'BTC':0.00201562,'ETH':0.09426829}},{'date':1563611400000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':21.19532286,'BTC':0.00201277,'ETH':0.09426009}},{'date':1563613200000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':21.2348958,'BTC':0.00201287,'ETH':0.09424746}},{'date':1563615000000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':21.3234638,'BTC':0.0020126,'ETH':0.09428486}},{'date':1563616800000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':21.23112695,'BTC':0.00201135,'ETH':0.09428095}},{'date':1563618600000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':21.2575089,'BTC':0.00201187,'ETH':0.09421819}},{'date':1563620400000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':21.27635316,'BTC':0.00201344,'ETH':0.09426411}},{'date':1563622200000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':21.01482491,'BTC':0.00200084,'ETH':0.093942}},{'date':1563624000000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':21.01482491,'BTC':0.00198785,'ETH':0.09338262}},{'date':1563625800000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':21.01482491,'BTC':0.00198871,'ETH':0.09327486}},{'date':1563627600000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':21.01482491,'BTC':0.00199779,'ETH':0.09336188}},{'date':1563629400000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.98136638,'BTC':0.00198884,'ETH':0.09313048}},{'date':1563631200000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.85195276,'BTC':0.00198115,'ETH':0.09281973}},{'date':1563633000000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.91560792,'BTC':0.00198026,'ETH':0.09262481}},{'date':1563634800000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.9452719,'BTC':0.00197693,'ETH':0.09253489}},{'date':1563636600000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.96482193,'BTC':0.00198191,'ETH':0.09245787}},{'date':1563638400000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':21.20165347,'BTC':0.00199724,'ETH':0.09227739}},{'date':1563640200000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':21.75600491,'BTC':0.00204506,'ETH':0.0937678}},{'date':1563642000000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':21.62474058,'BTC':0.00200716,'ETH':0.09250039}},{'date':1563643800000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':21.49265714,'BTC':0.00197427,'ETH':0.09278474}},{'date':1563645600000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':21.52728877,'BTC':0.00198121,'ETH':0.09282605}},{'date':1563647400000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':21.47441742,'BTC':0.00197244,'ETH':0.09273803}},{'date':1563649200000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':21.50393256,'BTC':0.00197272,'ETH':0.09255771}},{'date':1563651000000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':21.38473531,'BTC':0.0019664,'ETH':0.0923627}},{'date':1563652800000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':21.48621405,'BTC':0.00197146,'ETH':0.09287721}},{'date':1563654600000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':21.52084568,'BTC':0.00197887,'ETH':0.0933133}},{'date':1563656400000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':21.62232442,'BTC':0.00198311,'ETH':0.09342115}},{'date':1563658200000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':21.67789611,'BTC':0.00198935,'ETH':0.09366934}},{'date':1563660000000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':21.63762677,'BTC':0.00198043,'ETH':0.09301305}},{'date':1563661800000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':21.61507594,'BTC':0.00197671,'ETH':0.09265325}},{'date':1563663600000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':21.54822883,'BTC':0.00196312,'ETH':0.09265664}},{'date':1563665400000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':21.48701943,'BTC':0.0019643,'ETH':0.09252474}},{'date':1563667200000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':21.22041784,'BTC':0.00197579,'ETH':0.09299044}},{'date':1563669000000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':21.1962748,'BTC':0.0019707,'ETH':0.09292129}},{'date':1563670800000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':21.37587606,'BTC':0.0019834,'ETH':0.09343012}},{'date':1563672600000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':21.3008748,'BTC':0.00197743,'ETH':0.09329395}},{'date':1563674400000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':21.34043904,'BTC':0.00197707,'ETH':0.09343041}},{'date':1563676200000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':21.07063446,'BTC':0.00197256,'ETH':0.09308462}},{'date':1563678000000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.96190724,'BTC':0.00197104,'ETH':0.09312264}},{'date':1563679800000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.92405406,'BTC':0.0019719,'ETH':0.09309924}},{'date':1563681600000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.77264134,'BTC':0.00196441,'ETH':0.09268122}},{'date':1563683400000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.88861704,'BTC':0.00196289,'ETH':0.09279705}},{'date':1563685200000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':21.03278128,'BTC':0.001978,'ETH':0.0930654}},{'date':1563687000000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.92714496,'BTC':0.0019709,'ETH':0.09274572}},{'date':1563688800000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.77103056,'BTC':0.00196439,'ETH':0.09234032}},{'date':1563690600000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.81006575,'BTC':0.00196049,'ETH':0.09211662}},{'date':1563692400000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.76056053,'BTC':0.00196063,'ETH':0.09226096}},{'date':1563694200000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.86606621,'BTC':0.00196294,'ETH':0.09232364}},{'date':1563696000000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.81995117,'BTC':0.00196714,'ETH':0.09230338}},{'date':1563697800000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.9216379,'BTC':0.00196314,'ETH':0.09230406}},{'date':1563699600000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.95224259,'BTC':0.0019631,'ETH':0.09226405}},{'date':1563701400000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':21.00539812,'BTC':0.00195985,'ETH':0.09198773}},{'date':1563703200000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.9272756,'BTC':0.00195987,'ETH':0.09214193}},{'date':1563705000000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.83143457,'BTC':0.00196801,'ETH':0.09211743}},{'date':1563706800000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.81210529,'BTC':0.00197172,'ETH':0.09237508}},{'date':1563708600000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.83223996,'BTC':0.00197212,'ETH':0.09248908}},{'date':1563710400000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.76780902,'BTC':0.00196198,'ETH':0.09189703}},{'date':1563712200000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.59626163,'BTC':0.00195236,'ETH':0.09201743}},{'date':1563714000000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.56315073,'BTC':0.00194638,'ETH':0.09185309}},{'date':1563715800000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.56315073,'BTC':0.0019426,'ETH':0.09213294}},{'date':1563717600000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.56315073,'BTC':0.00195187,'ETH':0.09229007}},{'date':1563719400000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.56315073,'BTC':0.00196964,'ETH':0.09286944}},{'date':1563721200000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.56315073,'BTC':0.00197788,'ETH':0.0929576}},{'date':1563723000000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.56315073,'BTC':0.00197362,'ETH':0.09297441}},{'date':1563724800000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.56315073,'BTC':0.00196891,'ETH':0.0925351}},{'date':1563726600000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.56315073,'BTC':0.00197883,'ETH':0.09270197}},{'date':1563728400000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.56315073,'BTC':0.00198563,'ETH':0.0932823}},{'date':1563730200000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.56315073,'BTC':0.00198239,'ETH':0.09399008}},{'date':1563732000000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.56315073,'BTC':0.0019737,'ETH':0.09371594}},{'date':1563733800000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.56315073,'BTC':0.00195752,'ETH':0.09281494}},{'date':1563735600000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.56315073,'BTC':0.00195972,'ETH':0.0926769}},{'date':1563737400000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.56315073,'BTC':0.00196739,'ETH':0.09316397}},{'date':1563739200000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.56315073,'BTC':0.00197599,'ETH':0.09364338}},{'date':1563741000000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.50302738,'BTC':0.00195365,'ETH':0.09271095}},{'date':1563742800000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.5981219,'BTC':0.00196233,'ETH':0.09236826}},{'date':1563744600000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.75027314,'BTC':0.00195842,'ETH':0.09203528}},{'date':1563746400000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.80732986,'BTC':0.00197112,'ETH':0.09260049}},{'date':1563748200000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.82634876,'BTC':0.0019668,'ETH':0.09247113}},{'date':1563750000000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.69999065,'BTC':0.00196166,'ETH':0.09190601}},{'date':1563751800000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.78566865,'BTC':0.00197047,'ETH':0.09249997}},{'date':1563753600000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.82634876,'BTC':0.00196671,'ETH':0.09238909}},{'date':1563755400000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.88340548,'BTC':0.00196886,'ETH':0.0925806}},{'date':1563757200000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.80732986,'BTC':0.00196429,'ETH':0.09260461}},{'date':1563759000000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.78831095,'BTC':0.00196553,'ETH':0.09265605}},{'date':1563760800000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.78831095,'BTC':0.00196497,'ETH':0.09263953}},{'date':1563762600000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.78831095,'BTC':0.00196314,'ETH':0.09235555}},{'date':1563764400000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.9594811,'BTC':0.00197367,'ETH':0.09249142}},{'date':1563766200000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.90242438,'BTC':0.00196568,'ETH':0.09240274}},{'date':1563768000000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.80732986,'BTC':0.00196046,'ETH':0.09209636}},{'date':1563769800000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.75027314,'BTC':0.00196519,'ETH':0.09231781}},{'date':1563771600000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.77064369,'BTC':0.00196756,'ETH':0.09258968}},{'date':1563773400000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.80732986,'BTC':0.00196812,'ETH':0.09245648}},{'date':1563775200000,'ownBalance':{'USDT':0,'BTC':0,'ETH':0},'contractBalance':{'USDT':20.82634876,'BTC':0.00196589,'ETH':0.09247524}}];
}
