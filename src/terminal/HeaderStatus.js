import React from 'react';

class HeaderStatus extends React.Component {

  render() {
    return (
      <header className="header-status" dangerouslySetInnerHTML={{__html: html}} />
    );
  }
}

export default HeaderStatus;

const html = `
<div class="container-fuild h-100">
  <div class="row h-100 justify-content-between">
    <div class="curses-wrap row col-8 col-sm-8 col-md-6 col-lg-6  col-xl-4 ">
      <div class="curses h-100 row align-items-center justify-content-between col-4 col-sm-4 col-md-4 col-lg-4">
        <div class="curses-name col-auto">
          BTC/USD
        </div>
        <div class="curses-val col-auto">
          2542.2
        </div>
        <div class="curses-change up col-auto">
          <span class="icon icon-dir icon-up-dir"></span>
          6.94%
        </div>
      </div>
      <div class="curses h-100 row align-items-center justify-content-between col-4 col-sm-4 col-md-4 col-lg-4">
        <div class="curses-name col-auto">
          ETH/USD
        </div>
        <div class="curses-val col-auto">
          2542.2
        </div>
        <div class="curses-change down col-auto">
          <span class="icon icon-dir icon-down-dir"></span>
          6.94%
        </div>
      </div>
      <div class="curses h-100 row align-items-center justify-content-between col-4 col-sm-4 col-md-4 col-lg-4">
        <div class="curses-name col-auto">
          BTC/ETH
        </div>
        <div class="curses-val col-auto">
          0.1102
        </div>
        <div class="curses-change up col-auto">
          <span class="icon icon-dir icon-up-dir"></span>
          6.94%
        </div>
      </div>
    </div>
    <div class="row col-4 col-sm-4 col-md-3 col-lg-3 col-xl-2 justify-content-end align-items-center ">
      <div class="balance-title"> BALANCE:</div>
      <div class="balance-wrap">
        <div class="balance row justify-content-center">
          <div class="balance-name">BTC</div>
          <div class="balance-val">10.523</div>
        </div>
        <div class="balance row justify-content-center align-items-center">
          <div class="balance-name">ETH</div>
          <div class="balance-val">222.523</div>
        </div>
      </div>
    </div>
  </div>
</div>
`;
