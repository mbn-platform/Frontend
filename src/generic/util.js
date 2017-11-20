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
