import React from 'react';

export default class TopBanner extends React.PureComponent {
  render() {
    return (
      <a
        className="top_banner"
        rel="noopener"
        href="https://sale.membrana.io" target="_blank" //eslint-disable-line
      >30% bonus for all new investors and 50% bonus on additional investments until March 16. <u>Invest now!</u>
      </a>
    );
  }
}
