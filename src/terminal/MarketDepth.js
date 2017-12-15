import React from 'react';
import { Col, Row } from 'reactstrap';
import AmCharts from 'amcharts3/amcharts/amcharts';
import SerialChar from 'amcharts3/amcharts/serial';
import DataLoader from 'amcharts3/amcharts/plugins/dataloader/dataloader';
import AmChartsReact from "@amcharts/amcharts3-react";
import { getOrderBook } from '../api/bittrex/bittrex';

class MarketDepth extends React.Component {

  constructor(props) {
    super(props);
    this.state = {selectedCurrency: 0, selectedInterval: 0};
    this.formatNumber = this.formatNumber.bind(this);
    this.balloon = this.balloon.bind(this);
  }

  formatNumber(val, graphChart, precision) {
    return window.AmCharts.formatNumber(
      val, 
      {
        precision: precision ? precision : graphChart.precision, 
        decimalSeparator: graphChart.decimalSeparator,
        thousandsSeparator: graphChart.thousandsSeparator
      }
    );
  }  

  componentDidMount() {
    this.interval = setInterval(this.updateOrderBook.bind(this), 5000);
    this.updateOrderBook();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }



  updateOrderBook() {
    getOrderBook(this.props.market, 'both').then(json => {
      if(json.success) {
        let {buy, sell} = json.result;
        buy = buy.slice(0, 100);
        sell = sell.slice(0, 100);
        var res = this.getData(buy, sell);
        this.setState({data: res})
        this.setState({guides: []})
        console.log(this.addGuides(res))
        this.setState({guides: this.addGuides(res)})

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
                }
                else {
                  list[i].totalvolume = list[i].volume;
                }
                var dp = {};
                dp["value"] = list[i].value;
                dp[type + "volume"] = list[i].volume;
                dp[type + "totalvolume"] = list[i].totalvolume;
                res.unshift(dp);
              }
            }
            else {
              for(var i = 0; i < list.length; i++) {
                if (i > 0) {
                  list[i].totalvolume = list[i-1].totalvolume + list[i].volume;
                }
                else {
                  list[i].totalvolume = list[i].volume;
                }
                var dp = {};
                dp["value"] = list[i].value;
                dp[type + "volume"] = list[i].volume;
                dp[type + "totalvolume"] = list[i].totalvolume;
                res.push(dp);
              }
            }
           
          }
          var res = [];
          processData(sell, "sell", true);
          processData(buy, "buy", false);
          return res;
  }

  addGuides(res) {
          let type = ['sell', 'buy'],
          asks = [],
          bids = [];
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
          let minItemDownDiffAsks = minItemUpDiffAsks / 10;
          let minItemDownDiffBids = minItemUpDiffBids / 10;
          const guides = []
          let maxOffset = 0
          function addGuides(arr, min, max, type, color, reverse) {
           for(let i = 0; i < arr.length; i++) {
              let value = arr[i][type + 'totalvolume'];
              let valueNext = arr[i + 1] ? arr[i + 1][type + 'totalvolume'] : arr[i][type + 'totalvolume']
              if(reverse) {
                let valueChange = value;
                value = valueNext;
                valueNext = valueChange;
              }
              if(valueNext - value >= min && valueNext - value <= max) {
                if(getLabelOffset(arr[i+1]) > maxOffset) {
                  maxOffset = getLabelOffset(arr[i+1]);
                }
                guides.push( {
                  'above': true,
                  "category": arr[i+1].value,
                  "lineAlpha": 1,
                  "fillAlpha": 1,
                  'fontSize': 12,
                  "lineColor": color,
                  'labelOffset': getLabelOffset(arr[i+1]),
                  "label": parseFloat(arr[i+1].value.toFixed(2)) != 0 ? parseFloat(arr[i+1].value.toFixed(2)) : "",
                  "position": "bottom",
                  "inside": true,
                  "labelRotation": -90,
                  "expand": true,
                  'dashLength': 3
                } );              
              }
            }
          }
          function getLabelOffset(el) {
            let numb = parseFloat(el.value.toFixed(2)).toString();
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
          addGuides(asks, minItemDownDiffAsks, minItemUpDiffAsks, 'sell', '#32b893',true)
          addGuides(bids, minItemDownDiffBids, minItemUpDiffBids, 'buy', "#c74949")
          guides.forEach((item) => {
            item.labelOffset = 90 + maxOffset - 2 * item.labelOffset;
            console.log(item)
          })
          return guides;
        }  

  balloon(item, graph) {
    let txt = '';
    if (graph.id == "sell") {
      txt = "Ask: <strong>" + this.formatNumber(item.dataContext.value, graph.chart, 4) + "</strong><br />"
        + "Total volume: <strong>" + this.formatNumber(item.dataContext.selltotalvolume, graph.chart, 4) + "</strong><br />"
        + "Volume: <strong>" + this.formatNumber(item.dataContext.sellvolume, graph.chart, 4) + "</strong>";
    }
    else {
      console.log(this)
      txt = "Bid: <strong>" + this.formatNumber(item.dataContext.value, graph.chart, 4) + "</strong><br />"
        + "Total volume: <strong>" + this.formatNumber(item.dataContext.buytotalvolume, graph.chart, 4) + "</strong><br />"
        + "Volume: <strong>" + this.formatNumber(item.dataContext.buyvolume, graph.chart, 4) + "</strong>";
    }
    return txt;
  }   
  makeConfig(data) {
    return {
      "type": "serial",
      'startDuration': 0,
      'fontSize': 10,
      'color': '#6f6f71',
      "addClassNames": true,
      'fontFamily': 'maven_proregular',      
      "graphs": [{
        "id": "sell",
        "fillAlphas": 0.4,
        "lineAlpha": 1,
        "lineThickness": 2,
        "lineColor": "#32b893",
        "type": "step",
        "valueField": "selltotalvolume",
        "balloonFunction": this.balloon
      },{
        "id": "buy",
        "fillAlphas": 0.4,
        "lineAlpha": 1,
        "lineThickness": 2,
        "lineColor": "#c74949",
        "type": "step",
        "valueField": "buytotalvolume",
        "balloonFunction": this.balloon
        }
    
      ],
      "guides": this.state.guides,
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
        "showFirstLabel": false,
        "showLastLabel": false,
      },
       "export": {
          "enabled": true
        },
   "listeners": [{
      "event": "rendered",
      "method": function(e) {
        e.chart.guides = []
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
          <div className="chart-controls align-items-center justify-content-between row">
            <div className="control-resize"></div>
            <div className="control-dash"></div>
          </div>
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
  return Math.max((size - minSize) / (maxSize - minSize), 0.02);
}

export default MarketDepth;
