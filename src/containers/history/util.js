export const formatBalance = (value = 0, name) => (
  name === 'USDT' ? value.toFixed(2) : value.toFixed(8)
);

export const formatDate = (date) => {
  const [yyyy, mm, dd] = date.toISOString().substr(0,10).split('-');
  return `${dd}.${mm}.${yyyy}`;
};
