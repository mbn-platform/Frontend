import React from 'react';
import ReactDOM from 'react-dom';
import './styles/main.css';
import './index.css';
import App from './App';
import { IntlProvider, addLocaleData } from 'react-intl';
import { unregister } from './registerServiceWorker';
import enLocaleData from 'react-intl/locale-data/en';
import en from './lang/en';

const locale = 'en';

addLocaleData(enLocaleData);

ReactDOM.render(
  <IntlProvider locale={locale} messages={en}>
    <App />
  </IntlProvider>, document.getElementById('root'));
unregister();
