export function generateId(length) {
  length = length || 24;
  const validChars = '1234567890abcdef';
  let id = '';
  for(let i = 0; i < length; i++) {
    id += validChars.charAt(Math.floor(Math.random() * validChars.length));
  }
  return id;
}


export function generateTraderName() {
  return 'Trader' + Math.floor(Math.random() * 2048).toString(16);
}
