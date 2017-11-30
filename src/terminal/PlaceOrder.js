import React from 'react';

class PlaceOrder extends React.Component {
  render() {
    return (
      <div className="buysell col-12 col-sm-6 col-md-12">
        <div className="buysell__top justify-content-between row col-12">
          <div className="buysell__switch-wrap ">
            <a href='#' className="buysell__switch switch-buy active">
              BUY <span className="val">0.210</span>
            </a>
            <a href='#' className="buysell__switch switch-sell">
              SELL <span className="val">0.222</span>
            </a>

          </div>
          <div className="chart-controls align-items-center justify-content-between row">
            <div className="control-resize"></div>
            <div className="control-dash"></div>
          </div>
        </div>
        <div className="buysell__main">
          <div className="buysell__main-tab buy active">
            <form action="#" className="buysell__form" id="buy">
              <div className="buysell__form-row">
                <div className="buysell__form-input-wrap">
                  <label className="buysell__form-label">
                    Order size (ETH)
                  </label>
                  <input type="number" name='ordersize' className="buysell__form-input"/>
                </div>
                <div className="buysell__form-input-wrap">
                  <label className="buysell__form-label">
                    Price
                  </label>
                  <input type="number" name='Price' className="buysell__form-input"/>
                </div>
              </div>
              <div className="buysell__form-row">
                <div className="buysell__form-input-wrap">
                  <label className="buysell__form-label">
                    Amount (BTC)
                  </label>
                  <input type="number" name='Amout' className="buysell__form-input"/>
                </div>
                <button className="buysell__form-submit"> Place order</button>
              </div>
            </form>
          </div>
          <div className="buysell__main-tab sell">
            <form action="#" className="buysell__form" id="sell">
              <div className="buysell__form-row">
                <div className="buysell__form-input-wrap">
                  <label className="buysell__form-label">
                    Order size (ETH)
                  </label>
                  <input type="number" name='ordersize' className="buysell__form-input"/>
                </div>
                <div className="buysell__form-input-wrap">
                  <label className="buysell__form-label">
                    Price
                  </label>
                  <input type="number" name='Price' className="buysell__form-input"/>
                </div>
              </div>
              <div className="buysell__form-row">
                <div className="buysell__form-input-wrap">
                  <label className="buysell__form-label">
                    Amount (BTC)
                  </label>
                  <input type="number" name='Amout' className="buysell__form-input"/>
                </div>
                <button className="buysell__form-submit"> Place order</button>
              </div>
            </form>
          </div>

        </div>
      </div>
    );
  }
}

export default PlaceOrder;
