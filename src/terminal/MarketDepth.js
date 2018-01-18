import React from 'react';
import { Col, Row } from 'reactstrap';
import AmCharts from 'amcharts3/amcharts/amcharts';
import SerialChar from 'amcharts3/amcharts/serial';
import DataLoader from 'amcharts3/amcharts/plugins/dataloader/dataloader';
import AmChartsReact from "@amcharts/amcharts3-react";
import { getOrderBook } from '../api/bittrex/bittrex';
import { formatFloat } from '../generic/util';
import { Desktop } from '../generic/MediaQuery';

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
        precision: precision ? precision : graphChart.precision, 
        decimalSeparator: graphChart.decimalSeparator,
        thousandsSeparator: ' '
      }
    );
  }  

  componentDidMount() {
    this.interval = setInterval(this.updateOrderBook.bind(this), 5000);
    this.updateOrderBook();
    window.addEventListener("resize", this.onResize);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    window.removeEventListener("resize", this.onResize);
  }

  onResize() {
    const isDesktop = window.innerWidth > 768;
    if(this.state.isDesktop !== isDesktop) {
      this.setState({isDesktop});
    }
  }

  updateOrderBook() {
    this.setState({currency: this.props.market.split('-')})
    getOrderBook(this.props.market, 'buy').then(json => {
      if(json.success) {
        let buy = json.result;
        buy.sort((b1,b2) => (b1.Rate - b2.Rate))
        getOrderBook(this.props.market, 'sell').then(json => {
          if(json.success) {
            let sell = json.result;
            const maxBuy = buy.reduce((accum, value) => Math.max(accum, value.Quantity), 0);
            const maxSell = sell.reduce((accum, value) => Math.max(accum,value.Quantity), 0);
            const minBuy = buy.reduce((accum, value) => Math.min(accum, value.Quantity), maxBuy);
            const minSell = sell.reduce((accum, value) => Math.min(accum, value.Quantity), maxSell);   
            buy.forEach(order => order.relativeSize = relativeSize(minBuy, maxBuy, order.Quantity));
            sell.forEach(order => order.relativeSize = relativeSize(minSell, maxSell, order.Quantity));
            var res = this.getData(buy, sell);
            this.setState({data: res}) 
          }          
        }).catch(err => console.log('error updating order book', err));
      }
    }).catch(err => console.log('error updating order book', err));
  }

  getData(buy, sell) {
          function processData(list, type, desc) {
            // Convert to data points
            for(var i = 0; i < list.length; i++) {
              list[i] = {
                value: Number(list[i].Rate),
                volume: Number(list[i].Quantity),
                relativeSize: list[i].relativeSize,
                amount: 0
              }
            }
           
            // Sort list just in case
            list.sort(function(a, b) {
              if (a.value > b.value) {
                return 1;
              }
              else if (a.value < b.value) {
                return -1;
              }
              else {
                return 0;
              }
            });
            
            // Calculate cummulative volume
            if (desc) {
              for(var i = list.length - 1; i >= 0; i--) {
                if (i < (list.length - 1)) {
                  list[i].totalvolume = list[i+1].totalvolume + list[i].volume;
                  list[i].amount = list[i+1].amount + list[i].volume * list[i].value;
                }
                else {
                  list[i].totalvolume = list[i].volume;
                  list[i].amount = list[i].volume * list[i].value; 
                }
                var dp = {};
                dp["value"] = list[i].value;
                dp[type + "volume"] = list[i].volume;
                dp[type + "totalvolume"] = list[i].totalvolume;
                dp[type + "relativeSize"] = list[i].relativeSize;
                dp[type + "amount"] = list[i].amount;
                res.unshift(dp);
              }
            }
            else {
              for(var i = 0; i < list.length; i++) {
                if (i > 0) {
                  list[i].totalvolume = list[i-1].totalvolume + list[i].volume;
                  list[i].amount = list[i-1].amount + list[i].volume * list[i].value;
                }
                else {
                  list[i].totalvolume = list[i].volume;
                  list[i].amount = list[i].volume * list[i].value; 
                }
                var dp = {};
                dp["value"] = list[i].value;
                dp[type + "volume"] = list[i].volume;
                dp[type + "totalvolume"] = list[i].totalvolume;
                dp[type + "relativeSize"] = list[i].relativeSize;
                dp[type + "amount"] = list[i].amount;
                res.push(dp);
              }
            }
           
          }
          var res = [];
          processData(buy, "buy", true);          
          processData(sell, "sell", false);

          return res;
  }

  addGuides(chart, dashLength) {
          let isBTC = true;
          let type = ['sell', 'buy'],
          asks = [],
          bids = [],
          res = chart.dataProvider;
          if(!chart.dataProvider) {
            return;
          }
          res.forEach((item) => {
            if(item.hasOwnProperty(type[0] + 'volume')) {
              asks.push(item)
            }
            if(item.hasOwnProperty(type[1] + 'volume')) {
              bids.push(item)
            }
          })
          let minItemAsks = 0;
          let minItemUpDiffAsks = asks.reduce(function(diff, current, i, arr) {
            let diffCurrent = 0;

            if(arr[i + 1]) {
              diffCurrent = current.selltotalvolume - arr[i + 1].selltotalvolume;
            }
            if(diff == 0) {
              diff = diffCurrent;
            }
            if(diff < diffCurrent) {
              diff = diffCurrent;
              minItemAsks = i;
            }
            return diff;
          }, 0);
          let minItemBids = 0;
          let minItemUpDiffBids = bids.reduce(function(diff, current, i, arr) {
            let diffCurrent = 0;
            if(arr[i + 1]) {
              diffCurrent = arr[i + 1].buytotalvolume - current.buytotalvolume ;
            }
            if(diff == 0) {
              diff = diffCurrent;
            }
            if(diff < diffCurrent) {
              diff = diffCurrent;
              minItemBids = i;
            }
            return diff;
          }, 0);    
          minItemUpDiffAsks = minItemUpDiffBids = Math.max(minItemUpDiffBids, minItemUpDiffAsks)     
          if(chart.valueAxes.length > 0) {
            minItemUpDiffAsks = minItemUpDiffBids = chart.valueAxes[0].fullMax;
          }
          let minItemDownDiffAsks = minItemUpDiffAsks / 10;
          let minItemDownDiffBids = minItemUpDiffBids / 10;
          const guides = []
          let maxOffset = 0
          function addGuides(arr, min, max, type, color, reverse) {
           arr.sort((a1,a2) => a2[type + "relativeSize"] - a1[type + "relativeSize"])
           let countGuides = 0;
           for(let i = 0; i < arr.length - 1; i++) {
                if(countGuides == 3) {
                  break;
                }
                if(i > 0) {
                  if((arr[i].value > arr[i - 1].value && arr[i].value / 10 < arr[i].value - arr[i - 1].value) ||
                    (arr[i-1].value > arr[i].value && arr[i-1].value / 10 < arr[i-1].value - arr[i].value)) {
                    continue;  
                  }
                  
                }
                countGuides++;
                maxOffset = getLabelOffset(arr[i]);
                guides.push( {
                  'above': true,
                  "category": arr[i].value,
                  "lineAlpha": 1,
                  "fillAlpha": 1,
                  'fontSize': 12,
                  "lineColor": color,
                  'labelOffset': getLabelOffset(arr[i]),
                  "label": formatFloat(parseFloat(arr[i].value), isBTC) != 0 ? formatFloat(parseFloat(arr[i].value), isBTC) : "",
                  "position": "bottom",
                  "inside": true,
                  "labelRotation": -90,
                  'dashLength': dashLength ? 3 : 0
                } );              
              }            
           }
           
          function getLabelOffset(el) {
            let numb = formatFloat(parseFloat(el.value), isBTC);
            return str_size(numb, 'maven_proregular', '12');
          }

           function str_size(text, fontfamily, fontsize) {
              var str = document.createTextNode(text);
              var str_size = Array();
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
          
          addGuides(bids, minItemDownDiffBids, minItemUpDiffBids, 'buy', "#32b893", true)
          addGuides(asks, minItemDownDiffAsks, minItemUpDiffAsks, 'sell', '#c74949')
          guides.forEach((item) => {
            item.labelOffset = 90 + maxOffset - 2 * item.labelOffset;
          })
          chart.categoryAxis.guides = guides;
        }  

  balloon(item, graph) {
    const mainCurr = this.props.market.split('-')[0];
    const secCurr = this.props.market.split('-')[1];
    const isBTC = mainCurr === 'BTC' || mainCurr === 'ETH';
    let txt = '';
    if (graph.id == "sell") {
      txt = "Price: <strong>" + this.formatNumber(item.dataContext.value, graph.chart, isBTC ? 8 : 4) + "</strong><br />"
        + "Total volume ("+ secCurr +"): <strong>" + this.formatNumber(item.dataContext.selltotalvolume, graph.chart, 4) + "</strong><br />"
        + "Amount ("+ mainCurr +"): <strong>" + this.formatNumber(item.dataContext.sellamount, graph.chart, 4) + "</strong>";
    }
    else {
      console.log(this)
      txt = "Price: <strong>" + this.formatNumber(item.dataContext.value, graph.chart, isBTC ? 8 : 4) + "</strong><br />"
        + "Total volume ("+ secCurr +"): <strong>" + this.formatNumber(item.dataContext.buytotalvolume, graph.chart, 4) + "</strong><br />"
        + "Amount ("+ mainCurr +"): <strong>" + this.formatNumber(item.dataContext.buyamount, graph.chart, 4) + "</strong>";
    }
    return txt;
  }   
  makeConfig(data,guides) {
    const mainCurr = this.props.market.split('-')[0];
    const isBTC = mainCurr === 'BTC' || mainCurr === 'ETH';
    return {
      "type": "serial",
      'startDuration': 0,
      'fontSize': 10,
      "hideCredits": true,
      'color': '#6f6f71',
      "addClassNames": true,
      'fontFamily': 'maven_proregular',      
      "graphs": [{
        "id": "buy",
        "fillAlphas": 0.4,
        "lineAlpha": 1,
        "lineThickness": 2,
        "lineColor": "#32b893",
        "type": "step",
        "valueField": "buytotalvolume",
        "balloonFunction": this.balloon
        },{
        "id": "sell",
        "fillAlphas": 0.4,
        "lineAlpha": 1,
        "lineThickness": 2,
        "lineColor": "#c74949",
        "type": "step",
        "valueField": "selltotalvolume",
        "balloonFunction": this.balloon
      }
    
      ],
      "categoryField": "value",
      "chartCursor": {},
      "balloon": {
        "textAlign": "left"
      },
      "valueAxes": [{
        "position": "left"
      }],
      "categoryAxis": {
        "minHorizontalGap": 100,
        "startOnAxis": true,
        // "showFirstLabel": false,
        // "showLastLabel": false,
        "labelFunction": function(valueText) {
          return valueText ? formatFloat(parseFloat(valueText), isBTC) : valueText;
        }
      },
       "export": {
          "enabled": true
        },
   "listeners": [{
      "event": "dataUpdated",
      "method": (e) => {
        this.addGuides(e.chart, this.state.isDesktop)
      }
      }],        
      'dataProvider': data
    };
  }  

  renderChart() {
    const config = this.makeConfig(this.state.data)
          return ( 
          <AmChartsReact.React  style={{height: '100%', width: '100%', backgroundColor: 'transparent',position: 'absolute'}}
            options={config} 
           />  
           )
  }  

  render() {

    return (
      <Col xs="12" className="marketdepth-chart chart">
        <Row className="chart__top justify-content-between">
          <div className="justify-content-start row">
           <div className="chart-name">MARKET DEPTH</div>
          </div>
          <Desktop>
            <div className="chart-controls align-items-center justify-content-between row">
              <div className="control-resize"></div>
              <div className="control-dash"></div>
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

function relativeSize(minSize, maxSize, size) {
  return (size - minSize) / (maxSize - minSize);
}

export default MarketDepth;
