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
