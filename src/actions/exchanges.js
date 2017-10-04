import exchanges from '../demoData/exchanges';
export const UPDATE_EXCHANGES = 'UPDATE_EXCHANGES';

export const updateExchagnes = () => {
  return {
    type: UPDATE_EXCHANGES,
    exchanges: exchanges
  };
};
