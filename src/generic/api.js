import { apiPost } from '../generic/apiCall';
import {apiDelete, apiGet, apiPut} from './apiCall';
import {ABI, CONTRACT_ADDRESS, ETHEREUM_NET} from '../eth/MercatusFactory';
const errorHandler = resp => resp;
const responseSchemaHandler = resp => resp;

export class ApiAuth {
  constructor(web3) {
    this.web3 = web3;
  }

  logIn = () => {
    const {web3} = this;
    return new Promise( (res, rej) => { web3.eth.getAccounts((err, accounts) => {
      const address = accounts[0];
      if (!address) {
      }
      const message = web3.toHex('MembranaLogin');
      res(
        new Promise((resolve, reject) => {
          web3.personal.sign(message, address, (err, signature) => {
            if (!err) {
              resolve(this.auth(address, signature));
            }
            reject(err);
          });
        }));
      rej();
    });
    });
  };

  auth = (address, signature) =>
    apiPost('/auth', null, {addr: address, sgn: signature})
      .then(errorHandler)
      .then(responseSchemaHandler);

  addName = name =>
    apiPost('/auth/addName', null, {name})
      .then(errorHandler)
      .then(responseSchemaHandler);
}

export class ApiChallenge {
  update = number =>
    apiGet('/challenge/' + number)
      .then(errorHandler)
      .then(responseSchemaHandler);
}

export class ApiContract {
  fetch = () =>
    apiGet('/contract')
      .then(errorHandler)
      .then(responseSchemaHandler);

  rate = feedback =>
    apiPost('/feedback', null, feedback)
      .then(errorHandler)
      .then(responseSchemaHandler);
}

export class ApiDashboard {
  fetch = () =>
    apiGet('/api/dashboard')
      .then(errorHandler)
      .then(responseSchemaHandler);
}

export class ApiExchange {
  update = () =>
    apiGet('/exchanges')
      .then(errorHandler)
      .then(responseSchemaHandler);


  getCurrencies = exchange =>
    apiGet('/exchange/currencies?exchange=' + exchange)
      .then(errorHandler)
      .then(responseSchemaHandler);
}

export class ApiOffers {
  constructor(web3) {
    this.web3 = web3;
  }

  accept = offer =>
    apiPost(`/contract/${offer._id}/accept`)
      .then(errorHandler)
      .then(responseSchemaHandler);

  cancel = offer =>
    apiPost(`/contract/${offer._id}/cancel`)
      .then(errorHandler)
      .then(responseSchemaHandler);

  reject = offer =>
    apiPost(`/contract/${offer._id}/reject`)
      .then(errorHandler)
      .then(responseSchemaHandler);

  send = offer => 
    apiPost('/contract', null, offer)
      .then(errorHandler)
      .then(responseSchemaHandler);

  pay = offer => {
    const {web3} = this;
    return new Promise(res => web3.version.getNetwork((err, code) => {
      if (err) {
        alert('web3 error: no network');
      } else {
        if (ETHEREUM_NET === 'mainnet' && code !== '1') {
          alert('Please select main net in Metamask');
        } else if (ETHEREUM_NET === 'testnet' && code !== '3') {
          alert('Please select Ropsten network in Metamask');
        } else {
          web3.eth.getAccounts((err, accs) => {
            if (err) {
              alert('Metamask error: cannot get account');
            } else {
              const account = accs[0];
              if (!account) {
                alert('Unlock metamask');
                return;
              }
              res(ApiOffers.sendTransaction(CONTRACT_ADDRESS, offer, ETHEREUM_NET));
            }
          });
        }
      }
    })
    );
  };

  static sendTransaction = (address, offer, net) => {
    const contract = window.web3.eth.contract(ABI).at(address);
    const {contractSettings: {duration, currency, maxLoss, amount, startBalance, targetBalance}, _id} = offer;
    const investor = offer.from.name;
    const investorAddress = offer.from.address;
    const trader = offer.to.name;
    const traderAddress = offer.to.address;
    let contractCurrency;
    switch(currency) {
      case 'ETH':
        contractCurrency = 2;
        break;
      case 'BTC':
        contractCurrency = 1;
        break;
      case 'USDT':
        contractCurrency = 0;
        break;
      default:
        alert(offer.currency + ' not supported for contract yet');
        return;
    }
    contract.makeDeal(
      duration,
      maxLoss,
      startBalance,
      targetBalance,
      amount,
      investor,
      investorAddress,
      trader,
      traderAddress,
      '0x' + _id,
      contractCurrency,{value: amount},  (err, tx) => {
        if(err) {
          return;
        } else {
          let txUrl;
          switch(net) {
            case 'mainnet':
              txUrl = 'https://etherscan.io/tx/' + tx;
              break;
            case 'testnet':
              txUrl = 'https://ropsten.etherscan.io/tx/' + tx;
              break;
            default:
              throw new Error(`unkown selected net: ${net}`);
          }
          alert('You have sent transaction to pay this request.' +
            ' If transaction completes succesfully you will receive the contract.' +
            ' Check the transaction status in metamask or here: ' +
            txUrl + '\nDo not pay this request again, if the transaction has not completed yet');
        }
      });
  }
}

export class ApiProfile {
  updateContractSettings = (name, settings) =>
    apiPut(`/profile/${name}/contractSettings`, null, settings)
      .then(errorHandler)
      .then(responseSchemaHandler);

  toggleAvailable = (name, available) =>
    apiPut(`/profile/${name}/available`, null, available)
      .then(errorHandler)
      .then(responseSchemaHandler);

  getProfilePageInfo = name =>
    apiGet(`/profile/${name}`)
      .then(errorHandler)
      .then(responseSchemaHandler);

  getFeedbacks = name =>
    apiGet(`/profile/${name}/feedbacks`)
      .then(errorHandler)
      .then(responseSchemaHandler);

  getTradesForUser = name =>
    apiGet(`/profile/${name}/history`)
      .then(errorHandler)
      .then(responseSchemaHandler);
}

export class ApiTerminal {
  getExchangeMarkets = exchange =>
    apiGet('/exchange/markets?exchange=' + exchange)
      .then(errorHandler)
      .then(responseSchemaHandler);

  getExchangeRates = exchange =>
    apiGet('/exchange/rates?exchange=' + exchange)
      .then(errorHandler)
      .then(responseSchemaHandler);

  getMyOrders = key =>
    apiGet('/api/trades/' + key._id)
      .then(errorHandler)
      .then(responseSchemaHandler);

  getOrders = params => {
    const query = Object.entries(params).map(e => e.join('=')).join('&');
    return apiGet('/order?' + query)
      .then(errorHandler)
      .then(responseSchemaHandler);
  };
  cancelOrder = order =>
    apiDelete('/order/' + order._id)
      .then(errorHandler)
      .then(responseSchemaHandler);

  placeOrder = order =>
    apiPost('/order', null, order)
      .then(errorHandler)
      .then(responseSchemaHandler);

  updateRatings = () =>
    apiGet('/rating')
      .then(errorHandler)
      .then(responseSchemaHandler);
}

export class ApiTime {
  fetch = () =>
    apiGet('/time', null)
      .then(errorHandler)
      .then(responseSchemaHandler);
}

export class ApiKeys {
  fetch = () =>
    apiGet('/key')
      .then(errorHandler)
      .then(responseSchemaHandler);

  delete = key =>
    apiDelete('/key/' + key._id)
      .then(errorHandler)
      .then(responseSchemaHandler);

  add = key =>
    apiPost('/key', null, key)
      .then(errorHandler)
      .then(responseSchemaHandler);

  update = key => {
    apiPut('/api/key/' + key._id, null, {currencies: key.currencies})
      .then(errorHandler)
      .then(responseSchemaHandler);
  }
}
