import React from 'react';
import ReactDOM from 'react-dom';
import { IntlProvider } from 'react-intl';
import '@formatjs/intl-pluralrules/polyfill';
import '@formatjs/intl-pluralrules/dist/locale-data/en';
import '@formatjs/intl-relativetimeformat/polyfill';
import '@formatjs/intl-relativetimeformat/dist/locale-data/en';

import './styles/main.css';
import './index.css';
import App from './App';
import { unregister } from './registerServiceWorker';
import en from './lang/en';

const locale = 'en';

ReactDOM.render(
  <IntlProvider locale={locale} messages={en}>
    <App />
  </IntlProvider>, document.getElementById('root'));
unregister();
