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
