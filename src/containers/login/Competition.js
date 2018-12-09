import React from 'react';
import './Competition.css';

const bannerTexts = [
  'Get X% bonus on Membrana Platform presale',
  'Want passive income? Join presale now with X% bonus',
  'Make smart invesmtent with X% bonus, join presale now',
];

class Banner extends React.Component {

  constructor(props) {
    super(props);
    this.state = getRandomBanner();
  }

  render() {
    return (
      <a href={this.state.ref} className="competition__container">
        <div className="competition__subtitle competition__title">
          {this.state.text}
        </div>
      </a>
    );
  }
}
export default Banner;

function getRandomBanner() {
  const percent = getBonusPercent();
  const index = Math.floor(Math.random() * bannerTexts.length);
  console.log(index);
  const text = bannerTexts[index];
  const ref = `https://membrana.io/presale/?utm_source=beta_membrana_mobile&utm_medium=banner&utm_campaign=banner_mobile&utm_content=${index}`;
  const bannerText = text.replace('X%', `${percent}%`);
  return { ref, text: bannerText };
}

function getBonusPercent() {
  const date = Date.now();
  if (date < 1544486400000) {
    return 70;
  } else if (date < 1545696000000) {
    return 50;
  } else if (date < 1546905600000) {
    return 35;
  } else if (date < 1548115200000) {
    return 30;
  } else {
    return 25;
  }
}
