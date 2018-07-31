import React from 'react';

class BestInvestors extends React.Component {
  render() {
    return (
      <div className="ratings-investors ratings__best">
        <ul className="ratings__best-list">
          <li className="ratings__best-item best_alltime">
            <div className="ratings__best-top">
              <div className="time">All the time best investor</div>
              <div className="nickname">to be determined</div>
            </div>
            <div className="ratings__best-bottom">
              <div className="value"></div>
              <span className="text">ROI, %</span>
            </div>
          </li>
          <li className="dash"></li>
          <li className="ratings__best-item best_year">
            <div className="ratings__best-top">
              <div className="time">Best investor of <span className="year">2017</span></div>
              <div className="nickname">to be determined</div>
            </div>
            <div className="ratings__best-bottom">
              <div className="value"></div>
              <span className="text">ROI, %</span>
            </div>

          </li>
          <li className="dash"></li>
          <li className="ratings__best-item best_quart">
            <div className="ratings__best-top">
              <div className="time">Best investor of quart</div>
              <div className="nickname">to be determined</div>
            </div>
            <div className="ratings__best-bottom">
              <div className="value"></div>
              <span className="text">ROI, %</span>
            </div>

          </li>
          <li className="dash"></li>
          <li className="ratings__best-item best_month">
            <div className="ratings__best-top">
              <div className="time">
                Best investor of <span className="month">January</span>
              </div>
              <div className="nickname">to be determined</div>
            </div>
            <div className="ratings__best-bottom">
              <div className="value"></div>
              <span className="text">ROI, %</span>
            </div>

          </li>
        </ul>
      </div>
    );
  }
}

export default BestInvestors;
