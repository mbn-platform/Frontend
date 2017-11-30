import React from 'react';

class BestInvestors extends React.Component {
  render() {
    return (
      <div className="ratings__best">
        <ul className="ratings__best-list">
          <li className="ratings__best-item best_alltime">
            <div className="ratings__best-top">
              <div className="time">All the time best investor</div>
              <div className="nickname">@COINTRADERGUY</div>
            </div>
            <div className="ratings__best-bottom">
              <div className="value">28,912</div>
              <span className="text">ROI, %</span>
            </div>
          </li>
          <li className="dash"></li>
          <li className="ratings__best-item best_year">
            <div className="ratings__best-top">
              <div className="time">Best investor of <span className="year">2017</span></div>
              <div className="nickname">@CRYPTOGOD</div>
            </div>
            <div className="ratings__best-bottom">
              <div className="value">17,397</div>
              <span className="text">ROI, %</span>
            </div>

          </li>
          <li className="dash"></li>
          <li className="ratings__best-item best_quart">
            <div className="ratings__best-top">
              <div className="time">Best investor of quart</div>
              <div className="nickname">@LOOMDART</div>
            </div>
            <div className="ratings__best-bottom">
              <div className="value">9,254</div>
              <span className="text">ROI, %</span>
            </div>

          </li>
          <li className="dash"></li>
          <li className="ratings__best-item best_month">
            <div className="ratings__best-top">
              <div className="time">
                Best investor of <span className="month">November</span>
              </div>
              <div className="nickname">@COINTRADERGUY</div>
            </div>
            <div className="ratings__best-bottom">
              <div className="value">31,568</div>
              <span className="text">ROI, %</span>
            </div>

          </li>
        </ul>
      </div>
    );
  }
}

export default BestInvestors;
