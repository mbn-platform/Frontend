import React from 'react';
import { Col, Row } from 'reactstrap';
import { Desktop } from '../../generic/MediaQuery';
import classNames from 'classnames';
import {ESCAPE_KEYCODE} from '../../constants';


import TradingViewDatafeed from '../../generic/TradingViewDatafeed';
import {connect} from 'react-redux';

class TradingView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      ready: false, market: props.market, interval: props.interval,
    };
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentWillMount(){
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown(event) {
    if (this.props.fullScreen && event.keyCode === ESCAPE_KEYCODE) {
      this.props.onFullScreenChange(false);
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className="price-chart__top justify-content-between row col-12">
          <Desktop>
            <Row className="chart-controls align-items-center justify-content-between">
              <div className="control-resize" onClick={() => this.props.onFullScreenChange(!this.props.fullScreen)}/>
            </Row>
          </Desktop>
        </div>
        <div className="chart-name">{this.props.market.split('-').reverse().join('/')}</div>
        <TradingViewContainer
          symbol={this.props.market}
          exchange={this.props.exchange}
          interval={this.mapInterval(this.props.interval)}
        />
      </React.Fragment>
    );
  }

  mapInterval(interval) {
    let formatted;
    switch(interval) {
      case '1 MIN':
        formatted = '1';
        break;
      case '5 MIN':
        formatted = '5';
        break;
      case '30 MIN':
        formatted = '30';
        break;
      case '1 H':
        formatted = '60';
        break;
      case '4 H':
        formatted = '240';
        break;
      case '12 H':
        formatted = '720';
        break;
      case '1 D':
        formatted = '1D';
        break;
      case '1 W':
        formatted = '1W';
        break;
      default:
        formatted = '1D';
        break;
    }
    return formatted;
  }

}

class TradingViewContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {ready: false};
  }

  componentWillReceiveProps(nextProps) {
    if(this.state.ready) {
      if(nextProps.symbol !== this.props.symbol || nextProps.interval !== this.props.interval || nextProps.exchange !== this.props.exchange) {
        const symbol = nextProps.symbol + '@' + nextProps.exchange;
        this.updateChart(symbol, nextProps.interval);
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if(!prevState.ready && this.state.ready) {
      const symbol = this.props.symbol + '@' + this.props.exchange;
      this.updateChart(symbol, this.props.interval);
    }
  }

  componentDidMount() {
    const symbol = this.props.symbol + '@' + this.props.exchange;
    const path = process.env.REACT_APP_WEBSOCKET_ADDRESS;
    this.widget = createTradingView(symbol, this.props.interval, path);
    this.widget.onChartReady(() => {
      this.setState({ready: true});

    });
  }

  render() {
    const style = {
      height: '100%',
      paddingBottom: '37px',
    };
    if(!this.state.ready) {
      style.visibility = 'hidden';
    }
    return (
      <div style={style} id="tv_chart_container" className="tv_chart_container"/>
    );
  }

  updateChart(symbol, interval) {
    this.widget.setSymbol(symbol, interval, () => {
      const chart = this.widget.chart();
      const now = Math.floor(Date.now() / 1000);
      let range;
      switch(interval) {
        case '1':
          range = {
            from: now - 3600,
            to: now,
          };
          break;
        case '5':
          range = {
            from: now - 3600 * 6,
            to: now,
          };
          break;
        case '30':
          range = {
            from: now - 3600 * 24,
            to: now,
          };
          break;
        case '60':
          range = {
            from: now - 3600 * 24,
            to: now,
          };
          break;
        case '240':
          range = {
            from: now - 86400 * 4,
            to: now,
          };
          break;
        case '720':
          range = {
            from: now - 86400 * 14,
            to: now,
          };
          break;
        case '1D':
          range = {
            from: now - 86400 * 30,
            to: now,
          };
          break;
        case '1W':
          range = {
            from: now - 86400 * 180,
            to: now,
          };
          break;
        default:
          range = {
            from: now - 86400 * 30,
            to: now,
          };
          break;
      }
      chart.setVisibleRange(range);
    });
  }
}

function createTradingView(symbol, interval, socketPath) {
  const widget = window.tvWidget = new window.TradingView.widget({
    width: '100%',
    height: '100%',
    symbol,
    toolbar_bg: '#2C2F33',
    interval: interval,
    container_id: 'tv_chart_container',
    //	BEWARE: no trailing slash is expected in feed URL
    datafeed: new TradingViewDatafeed(socketPath),
    library_path: '/charting_library/charting_library/',
    locale: 'en',
    //	Regression Trend-related functionality is not implemented yet, so it's hidden for a while
    drawings_access: { type: 'black', tools: [ { name: 'Regression Trend' } ] },
    disabled_features: ['timezone_menu', 'pane_context_menu', 'legend_context_menu', 'display_market_status', 'timeframes_toolbar', 'main_series_scale_menu', 'control_bar', 'edit_buttons_in_legend', 'header_widget', 'use_localstorage_for_settings', 'scales_context_menu', 'show_chart_property_page'],
    enabled_features: ['study_templates', 'keep_left_toolbar_visible_on_small_screens'],
    charts_storage_url: 'http://saveload.tradingview.com',
    charts_storage_api_version: '1.1',
    client_id: 'tradingview.com',
    user_id: 'public_user_id',
    overrides: {
      'paneProperties.background': '#2C2F33',
      'paneProperties.vertGridProperties.color': '#2d3134',
      'paneProperties.vertGridProperties.style': 0,
      'paneProperties.horzGridProperties.color': '#2d3134',
      'paneProperties.horzGridProperties.style': 0,
      'paneProperties.legendProperties.showStudyArguments': false,
      'paneProperties.legendProperties.showStudyTitles': false,
      'paneProperties.legendProperties.showStudyValues': false,
      'paneProperties.legendProperties.showSeriesTitle': false,
      'paneProperties.legendProperties.showSeriesOHLC': false,
      'mainSeriesProperties.candleStyle.upColor': '#32b994',
      'mainSeriesProperties.candleStyle.downColor': '#d74c4c',
      'mainSeriesProperties.candleStyle.drawBorder': true,
      'mainSeriesProperties.candleStyle.borderUpColor': '#225437',
      'mainSeriesProperties.candleStyle.borderDownColor': '#5b1a13',
      'mainSeriesProperties.candleStyle.wickUpColor': '#737375',
      'mainSeriesProperties.candleStyle.wickDownColor': '#737375',
    },
    studies_overrides: {
      'volume.volume.color.0': '#4c4c4c',
      'volume.volume.color.1': '#4c4c4c',
      'volume.volume.transparency': 80,
    },
    custom_css_url: '../../../css/trading_view.css',
  });
  return widget;
}

const mapStateToProps = state => {
  const { market, exchange, interval} = state.terminal;
  return {
    exchange,
    market,
    interval
  };
};

export default connect(mapStateToProps)(TradingView);
