export const commissionPercent = (exchange, orderSide) => {
  if (exchange === 'bittrex') {
    return orderSide === 'buy' ? 1.0025 : 0.9975;
  }
  return 1;
};

export const floorBinance = (string, step) => {
  let afterComma;
  if(step.startsWith('1e')) {
    afterComma = parseInt(step.split('-')[1], 10);
  } else {
    afterComma = (step.toString().split('.')[1] || '').length;
  }
  const numberAfterComma = (string.split('.')[1] || '').length;
  if(afterComma === 0) {
    return Math.floor(parseFloat(string)).toString();
  } else if(numberAfterComma > afterComma) {
    return string.slice(0, afterComma - numberAfterComma);
  } else {
    return string;
  }
};
