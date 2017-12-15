import words from './words';
import names from './names';
export function generateRatings() {
  let traders = [];
  for(let i = 0; i < 25; i++) {
    traders.push(generateTraderRating(i + 1));
  }
  let investors = [];
  for(let i = 0; i < 25; i++) {
    investors.push(generateInvestorRating(i + 1));
  }
  return {traders, investors};
}

function generateTraderRating(rank) {
  const name = generateName();
  const totalContracts = Math.floor(Math.random() * 30);
  const successContracts = totalContracts - Math.floor(Math.random() * totalContracts);
  const dateCreated = (new Date(Date.now() - Math.floor(Math.random() * 365 + 20) * 86400000)).toString();
  const duration = Math.floor(Math.random() * 20 + 15);
  const roi = Math.floor(Math.random() * 30 - 15);
  const minAmount = Math.floor(Math.random() * 7 + 4);
  const minAmountCurrency = 'BTC';
  const fee = Math.floor(Math.random() * 10 + 10);
  const moneyInManagement = Math.floor(Math.random() * 30 + 10) + ' BTC';
  const maxLoss = Math.floor(Math.random() * 10 + 10);
  return {name, totalContracts, successContracts,
    dateCreated, duration, minAmount, minAmountCurrency,
    fee, moneyInManagement, maxLoss,
    roi, name, rank};
}
function generateInvestorRating(rank) {
  const name = generateName();
  const totalContracts = Math.floor(Math.random() * 30);
  const successContracts = totalContracts - Math.floor(Math.random() * totalContracts);
  const dateCreated = (new Date(Date.now() - Math.floor(Math.random() * 365 + 20) * 86400000)).toString();
  const paidExcessProfit = Math.floor(Math.random() * 30) + 10 + ' BTC';
  const paidInvoices = Math.floor(Math.random() * 10) + 5;
  return {
    name, totalContracts, successContracts, dateCreated, paidExcessProfit, paidInvoices,
  }
}
function generateName() {
  return words[Math.floor(Math.random() * words.length)] + 
    names[Math.floor(Math.random() * names.length)]; 
}
