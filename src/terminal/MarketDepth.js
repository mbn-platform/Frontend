import React from 'react';
import { Col, Row } from 'reactstrap';
import AmCharts from 'amcharts3/amcharts/amcharts';
import SerialChar from 'amcharts3/amcharts/serial';
import DataLoader from 'amcharts3/amcharts/plugins/dataloader/dataloader';
import AmChartsReact from "@amcharts/amcharts3-react";

class MarketDepth extends React.Component {

  constructor(props) {
    super(props);
    this.state = {selectedCurrency: 0, selectedInterval: 0};
    this.formatNumber = this.formatNumber.bind(this);
    this.balloon = this.balloon.bind(this);
  }

  componentDidMount() {
    // const chart = window.AmCharts.makeChart("chartdiv", );
    // this.chart = chart;
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

  balloon(item, graph) {
    let txt = '';
    if (graph.id == "asks") {
      txt = "Ask: <strong>" + this.formatNumber(item.dataContext.value, graph.chart, 4) + "</strong><br />"
        + "Total volume: <strong>" + this.formatNumber(item.dataContext.askstotalvolume, graph.chart, 4) + "</strong><br />"
        + "Volume: <strong>" + this.formatNumber(item.dataContext.asksvolume, graph.chart, 4) + "</strong>";
    }
    else {
      console.log(this)
      txt = "Bid: <strong>" + this.formatNumber(item.dataContext.value, graph.chart, 4) + "</strong><br />"
        + "Total volume: <strong>" + this.formatNumber(item.dataContext.bidstotalvolume, graph.chart, 4) + "</strong><br />"
        + "Volume: <strong>" + this.formatNumber(item.dataContext.bidsvolume, graph.chart, 4) + "</strong>";
    }
    return txt;
  }    

  render() {
    let config = {
      "type": "serial",
      'startDuration': 0,
      'fontSize': 10,
      'color': '#6f6f71',
      "addClassNames": true,
      'fontFamily': 'maven_proregular',      
      "dataLoader": {
        "url": "https://poloniex.com/public?command=returnOrderBook&currencyPair=BTC_ETH&depth=50",
        "format": "json",
        "postProcess": function(data) {
          
          // Function to process (sort and calculate cummulative volume)
          function processData(list, type, desc) {
            
            // Convert to data points
            for(var i = 0; i < list.length; i++) {
              list[i] = {
                value: Number(list[i][0]),
                volume: Number(list[i][1]),
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
          processData(data.bids, "bids", true);
          processData(data.asks, "asks", false);
          return res;
        }
        ,
        "complete": function() {
          for(let i=0; i < this.chart.dataProvider.length - 1;i++) {
            let value = this.chart.dataProvider[i].value;
            if (i == 27 && this.chart.dataProvider[i + 1]) {
              this.chart.categoryAxis.guides.push( {
                'above': true,
                "category": value,
                "lineAlpha": 1,
                "fillAlpha": 1,
                'fontSize': 12,
                "lineColor": "#2d4a46",
                'labelOffset': 70,
                "label": value.toFixed(3),
                "position": "bottom",
                "inside": true,
                "labelRotation": -90,
                "expand": true,
                'dashLength': 3
              } );
            }
            if (i == 44 && this.chart.dataProvider[i + 1]) {
              //add a guide
              this.chart.categoryAxis.guides.push( {
                'above': true,
                "category": value,
                "lineAlpha": 1,
                'boldLabel': true,
                "fillAlpha": 1,
                'fontSize': 12,
                'labelOffset': 70,
                "lineColor": "#32b893",
                "label": value.toFixed(3),
                "position": "bottom",
                "inside": true,
                "labelRotation": -90,
                "expand": true,
                'dashLength': 3
              } );
            }               
          }
          setTimeout(() => {
            let array = document.querySelectorAll('.amcharts-guide');
            for(let i = 0; i < array.length; i++) {
              if(array[i].nodeName == "text") {
                console.log(array[i].getBoundingClientRect());
              }
            }
          }, 1)
          

        }
      },
      "graphs": [{
        "id": "bids",
        "fillAlphas": 0.4,
        "lineAlpha": 1,
        "lineThickness": 2,
        "lineColor": "#32b893",
        "type": "step",
        'type': 'smoothedLine',
        "valueField": "bidstotalvolume",
        "balloonFunction": this.balloon
      }, {
        "id": "asks",
        "fillAlphas": 0.4,
        "lineAlpha": 1,
        "lineThickness": 2,
        "lineColor": "#c74949",
        "type": "step",
        'type': 'smoothedLine',
        "valueField": "askstotalvolume",
        "balloonFunction": this.balloon
        }
      ],
      "categoryField": "value",
      "chartCursor": {},
      "balloon": {
        "textAlign": "left"
      },
      "valueAxes": [{
        "position": "right"
      }],
      "categoryAxis": {
        "minHorizontalGap": 100,
        "startOnAxis": true,
        "showFirstLabel": false,
        "showLastLabel": false,
      },
      "export": {
        "enabled": true
      }
    };
    return (
      <Col xs="12" className="marketdepth-chart chart">
        <Row className="chart__top justify-content-between">
          <div className="chart-controls align-items-center justify-content-between row">
            <div className="control-resize"></div>
            <div className="control-dash"></div>
          </div>
        </Row>
        <div className="marketdepth-chart__graph row col-12" id='chartdiv' >
          <AmChartsReact.React  style={{height: '100%', width: '100%', backgroundColor: 'transparent',position: 'absolute'}}
           options={config} 
           />  

        </div>
        <div className="marketdepth-chart__item" id='chartitem' >
        </div>
      </Col>
    );
  }
}

export default MarketDepth;
