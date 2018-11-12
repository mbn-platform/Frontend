import React from 'react';
import { Col, Row } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import {connect} from 'react-redux';
import AmChartsReact from '@amcharts/amcharts3-react';
import { formatFloat, defaultFormatValue } from '../../generic/util';
import { Desktop } from '../../generic/MediaQuery';
import debounceRender from 'react-debounce-render';

class MarketDepth extends React.Component {

  constructor(props) {
    super(props);
    const isDesktop = window.innerWidth > 768;
    this.state = {selectedCurrency: 0, selectedInterval: 0, isDesktop};
    this.formatNumber = this.formatNumber.bind(this);
    this.balloon = this.balloon.bind(this);
    this.onResize = this.onResize.bind(this);
  }

  formatNumber(val, graphChart, precision) {
    return window.AmCharts.formatNumber(
      val,
      {
        precision: -1,
        decimalSeparator: graphChart.decimalSeparator,
        thousandsSeparator: ' '
      }
    );
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  onResize() {
    const isDesktop = window.innerWidth > 768;
    if(this.state.isDesktop !== isDesktop) {
      this.setState({isDesktop});
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.buy && nextProps.sell &&
      (nextProps.buy !== this.props.buy || nextProps.sell !== this.props.sell)) {
      const data = this.getData(nextProps);
      this.setState({data});
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(nextState === this.state) {
      return false;
    } else {
      return true;
    }
  }

  getData(props) {
    function processData(list, minSize, maxSize, type, desc, last) {
      list = list
        .filter(e => e.Rate < last * 10 && e.Rate > last / 10)
        .map(e => ({
          value: Number(e.Rate),
          volume: Number(e.Quantity),
          amount: 0,
          relativeSize: relativeSize(minSize, maxSize, e.Rate * e.Quantity),
        }));

      // Sort list just in case
      list.sort((a, b) => a.value - b.value);

      // Calculate cummulative volume
      if (desc) {
        for(let i = list.length - 1; i >= 0; i--) {
          if (i < (list.length - 1)) {
            list[i].totalvolume = list[i+1].totalvolume + list[i].volume;
            list[i].amount = list[i+1].amount + list[i].volume * list[i].value;
          }
          else {
            list[i].totalvolume = list[i].volume;
            list[i].amount = list[i].volume * list[i].value;
          }
          let dp = {};
          dp['value'] = list[i].value;
          dp[type + 'volume'] = list[i].volume;
          dp[type + 'totalvolume'] = list[i].totalvolume;
          dp[type + 'relativeSize'] = list[i].relativeSize;
          dp[type + 'amount'] = list[i].amount;
          res.unshift(dp);
        }
      }
      else {
        for(let i = 0; i < list.length; i++) {
          if (i > 0) {
            list[i].totalvolume = list[i-1].totalvolume + list[i].volume;
            list[i].amount = list[i-1].amount + list[i].volume * list[i].value;
          }
          else {
            list[i].totalvolume = list[i].volume;
            list[i].amount = list[i].volume * list[i].value;
          }
          let dp = {};
          dp['value'] = list[i].value;
          dp[type + 'volume'] = list[i].volume;
          dp[type + 'totalvolume'] = list[i].totalvolume;
          dp[type + 'relativeSize'] = list[i].relativeSize;
          dp[type + 'amount'] = list[i].amount;
          res.push(dp);
        }
      }

    }
    let res = [];
    processData(props.buy, props.minBuy, props.maxBuy, 'buy', true, (props.ticker || {}).l);
    processData(props.sell, props.minSell, props.maxSell ,'sell', false, (props.ticker || {}).l);

    return res;
  }

  addGuides(data, isDesktop) {
    let isBTC = true;
    let type = ['sell', 'buy'],
      asks = [],
      bids = [],
      res = data;
    if(!res) {
      return;
    }

    res.forEach((item) => {
      if(item.hasOwnProperty(type[0] + 'volume')) {
        asks.push(item);
      }
      if(item.hasOwnProperty(type[1] + 'volume')) {
        bids.push(item);
      }
    });
    let minItemUpDiffAsks = asks.reduce(function(diff, current, i, arr) {
      let diffCurrent = 0;

      if(arr[i + 1]) {
        diffCurrent = current.sellamount - arr[i + 1].sellamount;
      }
      if(diff === 0) {
        diff = diffCurrent;
      }
      if(diff < diffCurrent) {
        diff = diffCurrent;
      }
      return diff;
    }, 0);
    let minItemUpDiffBids = bids.reduce(function(diff, current, i, arr) {
      let diffCurrent = 0;
      if(arr[i + 1]) {
        diffCurrent = arr[i + 1].buyamount - current.buyamount;
      }
      if(diff === 0) {
        diff = diffCurrent;
      }
      if(diff < diffCurrent) {
        diff = diffCurrent;
      }
      return diff;
    }, 0);
    minItemUpDiffAsks = minItemUpDiffBids = Math.max(minItemUpDiffBids, minItemUpDiffAsks);
    let minItemDownDiffAsks = minItemUpDiffAsks / 10;
    let minItemDownDiffBids = minItemUpDiffBids / 10;
    const guides = [];
    let maxOffset = 0;
    function addGuides(arr, min, max, type, color, reverse) {
      arr.sort((a1,a2) => a2[type + 'relativeSize'] - a1[type + 'relativeSize']);
      let countGuides = 0;
      const maxValue = arr.reduce((accum, value) => Math.max(accum,value.value), 0);
      const minValue = arr.reduce((accum, value) => Math.min(accum,value.value), maxValue);
      const gap = isDesktop ? 15 : 4;
      let lastValues = [];
      for(let i = 0; i < arr.length; i++) {
        if(i > 0) {
          let valid = true;
          for(let j = 0; j < lastValues.length; j++) {
            if(Math.abs(lastValues[j] - arr[i].value) < (maxValue - minValue) / gap) {
              valid = false;
            }
          }
          if(!valid) {
            continue;
          }
        }
        lastValues.push(arr[i].value);
        maxOffset = getLabelOffset(arr[i]);
        guides.push( {
          'above': true,
          'category': arr[i].value,
          'lineAlpha': 1,
          'fillAlpha': 1,
          'fontSize': 12,
          'lineColor': color,
          'label': formatFloat(parseFloat(arr[i].value), isBTC) !== 0 ? formatFloat(parseFloat(arr[i].value), isBTC) : '',
          'position': 'bottom',
          'inside': true,
          'labelRotation': -90,
          'dashLength': isDesktop ? 3 : 0
        } );
        countGuides++;
        if(countGuides === 3) {
          break;
        }
      }
    }

    function getLabelOffset(el) {
      let numb = formatFloat(parseFloat(el.value), isBTC);
      return str_size(numb, 'maven_proregular', '12');
    }

    function str_size(text, fontfamily, fontsize) {
      var str = document.createTextNode(text);
      var str_size = [];
      var obj = document.createElement('A');
      obj.style.fontSize = fontsize + 'px';
      obj.style.fontFamily = fontfamily;
      obj.style.margin = 0 + 'px';
      obj.style.padding = 0 + 'px';
      obj.appendChild(str);
      document.body.appendChild(obj);
      str_size[0] = obj.offsetWidth;
      str_size[1] = obj.offsetHeight;
      document.body.removeChild(obj);
      return str_size[0];
    }

    addGuides(bids, minItemDownDiffBids, minItemUpDiffBids, 'buy', '#32b893', true);
    addGuides(asks, minItemDownDiffAsks, minItemUpDiffAsks, 'sell', '#c74949');
    guides.forEach((item) => {
      item.labelOffset = 90 + maxOffset - 2 * item.labelOffset;
    });
    return guides;
  }

  balloon(item, graph) {
    const [main, second] = this.props.market.split('-');
    let txt = '';
    if (graph.id === 'sell' && item.dataContext.sellamount) {
      txt = '<FormattedMessage id="terminal.price" defaultMessage="Price:"/> <strong>' + defaultFormatValue(item.dataContext.value, main) + '</strong><br />'
        + '<FormattedMessage id="terminal.totalVolume" defaultMessage="Total volume:"/> ('+ second +'): <strong>' + defaultFormatValue(item.dataContext.selltotalvolume, second) + '</strong><br />'
        + '<FormattedMessage id="terminal.amount" defaultMessage="Amount"/> ('+ main +'): <strong>' + defaultFormatValue(item.dataContext.sellamount, main) + '</strong>';
    }
    else if(graph.id === 'buy' && item.dataContext.buyamount) {
      txt = '<FormattedMessage id="terminal.price" defaultMessage="Price:"/> <strong>' + defaultFormatValue(item.dataContext.value, main) + '</strong><br />'
        + '<FormattedMessage id="terminal.totalVolume" defaultMessage="Total volume:"/> ('+ second +'): <strong>' + defaultFormatValue(item.dataContext.buytotalvolume, second) + '</strong><br />'
        + '<FormattedMessage id="terminal.amount" defaultMessage="Amount"/> ('+ main +'): <strong>' + defaultFormatValue(item.dataContext.buyamount, main) + '</strong>';
    }
    return txt;
  }

  makeConfig(data,guides) {
    const main = this.props.market.split('-')[0];
    return {
      'type': 'serial',
      'startDuration': 0,
      'fontSize': 10,
      'hideCredits': true,
      'color': '#6f6f71',
      'addClassNames': true,
      'fontFamily': 'maven_proregular',
      'graphs': [{
        'id': 'buy',
        'fillAlphas': 0.4,
        'lineAlpha': 1,
        'lineThickness': 2,
        'lineColor': '#32b893',
        'type': 'step',
        'valueField': 'buyamount',
        'balloonFunction': this.balloon
      },{
        'id': 'sell',
        'fillAlphas': 0.4,
        'lineAlpha': 1,
        'lineThickness': 2,
        'lineColor': '#c74949',
        'type': 'step',
        'valueField': 'sellamount',
        'balloonFunction': this.balloon
      }

      ],
      'categoryField': 'value',
      'chartCursor': {
        cursorColor: '#c74949',
        oneBalloonOnly: true,
        categoryBalloonFunction: value => defaultFormatValue(parseFloat(value), main) || '',
      },
      'balloon': {
        'textAlign': 'left'
      },
      'valueAxes': [{
        'position': 'left'
      }],
      guides: this.addGuides(data, this.state.isDesktop),
      'categoryAxis': {
        'minHorizontalGap': 100,
        'startOnAxis': true,
        // "showFirstLabel": false,
        // "showLastLabel": false,
        'labelFunction': function(valueText) {
          return valueText ? defaultFormatValue(parseFloat(valueText), main) : valueText;
        }
      },
      'export': {
        'enabled': true
      },
      'listeners': [{
        'event': 'dataUpdated',
        'method': (e) => {
        }
      }],
      'dataProvider': data
    };
  }

  renderChart() {
    const config = this.makeConfig(this.state.data);
    return (
      <AmChartsReact.React  style={{height: '100%', width: '100%', backgroundColor: 'transparent',position: 'absolute'}}
        options={config}
      />
    );
  }

  render() {
    return (
      <Col className="marketdepth-chart chart">
        <Row className="chart__top justify-content-between">
          <div className="justify-content-start row">
            <div className="chart-name">
              <FormattedMessage id="terminal.marketDepth" defaultMessage="MARKET DEPTH"/>
            </div>
          </div>
          <Desktop>
            <div className="chart-controls align-items-center justify-content-between row">
            </div>
          </Desktop>
        </Row>
        <div className="marketdepth-chart__graph row col-12" id='chartdiv' >
          {this.renderChart()}
        </div>
        <div className="marketdepth-chart__item" id='chartitem' >
        </div>
      </Col>
    );
  }
}

const mapStateToProps = state => {
  const { market, exchange, ticker, orderBook} = state.terminal;
  return {
    exchange,
    ticker,
    market,
    ...orderBook,
  };
};


function relativeSize(minSize, maxSize, size) {
  return (size - minSize) / (maxSize - minSize);
}

export default debounceRender(connect(mapStateToProps)(MarketDepth), 2000, {maxWait: 2000}) ;
