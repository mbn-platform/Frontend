export const makeId = length => {
  length = length || 24;
  let text = '';
  let possible = 'abcdef0123456789';
  for (let i = 0; i < 24; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
};

export function formatDate(date) {
  let year = date.getFullYear() % 100;
  let month = date.getMonth() + 1;
  let day = date.getDate();
  year = padDate(year);
  month = padDate(month);
  day = padDate(day);
  return day + '.' + month + '.' + year;
}

function padDate(number) {
  return number < 10 ? '0' + number : number;
}

export function formatFloatValue(value, currency) {
  if(currency === 'USDT') {
    return value.toFixed(2);
  } else {
    if(Number.isInteger(value)) {
      return value.toString();
    } else {
      return value.toFixed(8);
    }
  }
}

export function formatFloat(number, isBTC) {
  if(!number && number !== 0) {
    return '';
  }
  if(number > 10) {
    return number.toFixed(2);
  } else if(number > 1) {
    return number.toFixed(3);
  } else if(number > 0.1) {
    return number.toFixed(4);
  } else if(number > 0.01) {
    return number.toFixed(4);
  } else if(isBTC) {
    return number.toFixed(8);
  } else {
    return number.toFixed(5);
  }
}

export function formatBTCValue(value) {
  const number = Number(value);
  if(isNaN(number)) {
    return '';
  } else {
    return number.toFixed(8);
  }
}

function convert(currencies, currency, rates) {
  let balance = 0;
  for(let i = 0; i < currencies.length; i++) {
    const cur = currencies[i];
    const {name, totalBalance, enabled} = cur;
    if(!enabled || !totalBalance) {
      continue;
    }
    switch(name) {
      case 'BTC':
        balance += totalBalance;
        break;
      case 'USDT': {
        const rate = rates.USDT.BTC;
        const add = totalBalance / rate || 0;
        balance += add;
        break;
      }
      default: {
        const rate = rates.BTC[name];
        const add = totalBalance * rate || 0;
        balance += add;
      }
    }
  }
  switch(currency) {
    case 'BTC':
      return balance;
    case 'USDT': {
      const rate = rates.USDT.BTC;
      return rate * balance || 0;
    }
    default: {
      const rate = rates.BTC[currency];
      return balance / rate || 0;
    }
  }
}

export function defaultFormatValue(value, currency) {
  if(currency === 'USDT') {
    return value.toFixed(2);
  } else {
    return value.toFixed(8);
  }
}

export function calculateKeyBalance(key, currency, rates) {
  return rates ? convert(key.currencies, currency, rates) : null;
}

export function isContract(fund) {
  return typeof fund.from !== undefined;
}

export function setFundId(payload, fund) {
  if (isContract(fund)) {
    payload.contractId = fund._id;
  } else {
    payload.keyId = fund._id;
  }
  return payload;
}