import io from 'socket.io-client';

class TradingViewDatafeed {
  constructor(path) {
    this.socket = io('', {path});
    this._subscriptions = {};
    this._subscriptionsuids = {};
  }

  onReady(callback) {
    setTimeout(() => callback(TradingViewDatafeed.defaultConfigurationData));
  }

  static defaultConfigurationData = {
    supports_search: true,
    supports_group_request: false,
    supported_resolutions: ['1', '5', '15', '30', '60', '1D', '1W', '1M'],
    supports_marks: false,
    supports_timescale_marks: false
  }

  resolveSymbol(symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
    setTimeout(() => {
      const [symbol, exchange] = symbolName.split('@');
      onSymbolResolvedCallback({
        exchange,
        name: symbol,
        timezone: 'America/New_York',
        minmov: 1,
        minmov2: 0,
        pointvalue: 1,
        has_intraday: true,
        has_weekly_and_monthly: false,
        has_no_volume: false,
        type: 'stock',
        session: '24x7',
        supported_resolutions: [
          '1',
          '5',
          '30',
          '60',
          '240',
          '720',
          '1D',
          '1W',
        ],
        intraday_multipliers: [
          '1',
          '5',
          '30',
          '60',
        ],
        pricescale: 100000000,
        ticker: symbolName,
      });
    }, 0);
  }

  getBars(symbolInfo, resolution, from, to, callback, errorCallback, firstDataRequest) {
    if(!firstDataRequest) {
      callback([], {noData: true});
      return;
    }
    let interval;
    switch(resolution) {
      case '1':
        interval = '1m';
        break;
      case '5':
        interval = '5m';
        break;
      case  '30':
        interval = '30m';
        break;
      case '60':
        interval = '1h';
        break;
      case 'D':
      case '1D':
        interval = '1d';
        break;
      default:
        throw new Error('unknown interval');
    }

    this.socket.emit('candles', {exchange: symbolInfo.exchange, symbol: symbolInfo.name, interval: interval});
    this.socket.off('candles');
    this.socket.on('candles', data => {
      if(data.firstId === 0) {
        data = data.content.candles;
        data = data.map(d => ({
          time: d.T,
          close: d.C,
          open: d.O,
          high: d.H,
          low: d.L,
          volume: d.V,
        }));
        callback(data);
      } else {
        const realtimeCallback = this._subscriptions[data.name];
        if(realtimeCallback) {
          const candleData = data.content.candles.map(d => ({
            time: d.T,
            close: d.C,
            open: d.O,
            high: d.H,
            low: d.L,
            volume: d.V,
          })).sort((d1, d2) => d1.time - d2.time);
          candleData.forEach(d => realtimeCallback(d));
        }
      }
    });
  }

  subscribeBars(info, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) {
    let interval;
    switch(resolution) {
      case '1':
        interval = '1m';
        break;
      case '5':
        interval = '5m';
        break;
      case  '30':
        interval = '30m';
        break;
      case '60':
        interval = '1h';
        break;
      case 'D':
      case '1D':
        interval = '1d';
        break;
      default:
        throw new Error('unknown interval');
    }
    const tag = `${info.exchange}.candles.${info.name}.${interval}`;
    this._subscriptionsuids[subscriberUID] = tag;
    this._subscriptions[tag] = onRealtimeCallback;
  }
  unsubscribeBars(uid) {
    const tag = this._subscriptionsuids[uid];
    delete this._subscriptionsuids[uid];
    if(tag) {
      delete this._subscriptions[tag];
    }
  }
}

export default TradingViewDatafeed;
