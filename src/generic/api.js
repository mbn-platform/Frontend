import { apiPost } from '../generic/apiCall';
import {apiDelete, apiGet, apiPut} from './apiCall';
import {ABI, CONTRACT_ADDRESS, ETHEREUM_NET} from '../eth/MercatusFactory';
import store from '../store'; //TODO: REMOVE, ONLY FOR EXAMPLE
import qs from 'qs';
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

export class ApiTwoFactorAuth {
  enable = () =>
    apiGet('/mfa/enable')
      .then(errorHandler)
      .then(responseSchemaHandler)

  confirm = token =>
    apiPost('/mfa/confirm', null, {token})
      .then(errorHandler)
      .then(responseSchemaHandler)

  disable = token =>
    apiPut('/mfa/disable', { headers: {'X-2FA': token}})
      .then(errorHandler)
      .then(responseSchemaHandler)
}

export class ApiChallenge {
  update = number =>
    apiGet('/challenge/result?' + qs.stringify({round: number}))
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

export class Hashlog {

  fetchBlocksPage = (currentPage, pageSize) => {
    // return apiGet('/hashlog/blocks?page=' + currentPage + '&size=' + pageSize, null)
    //   .then(errorHandler)
    //   .then(responseSchemaHandler);
    //TODO: REMOVE, ONLY FOR EXAMPLE
    return new Promise(resolve => {
      let testData = [];
      for (let i = 0; i < store.getState().hashlog.blocksPageSize; i++) {
        testData.push({
          actions: '123',
          createdAt: '09/13/18 14:01',
          hash: 'ad662eb20c95681ca481bd359ea8cc8f10d456eccaa0fd483ea14226a5f9d27e',
          number: i + 1,
          vertex: 'vertex',
        });
      }
      resolve({items : testData, count: 300});
    });
  }

  fetchActionsPage = () =>
    apiGet('/hashlog/actions', null)
      .then(errorHandler)
      .then(responseSchemaHandler);
}

export class ApiKeys {
  fetch = () =>
    apiGet('/key')
      .then(errorHandler)
      .then(responseSchemaHandler);

  delete = (key, token2FA) =>
    apiDelete('/key/' + key._id, token2FA && {headers: {'X-2FA': token2FA}})
      .then(errorHandler)
      .then(responseSchemaHandler);

  add = (key, token2FA) =>
    apiPost('/key', token2FA && {headers: {'X-2FA': token2FA}}, key)
      .then(errorHandler)
      .then(responseSchemaHandler);

  update = key => {
    apiPut('/api/key/' + key._id, null, {currencies: key.currencies})
      .then(errorHandler)
      .then(responseSchemaHandler);
  }
}

export class ApiBotKeys {
  fetch = () =>
    apiGet('/bot-api-key')
      .then(errorHandler)
      .then(responseSchemaHandler);

  add = (label, keyId, token2FA) =>
    apiPost('/bot-api-key ', token2FA && {headers: {'X-2FA': token2FA}}, {label, keyId})
      .then(errorHandler)
      .then(responseSchemaHandler);

  delete = (keyID, token2FA) =>
    apiDelete('/bot-api-key/'+ keyID, token2FA && {headers: {'X-2FA': token2FA}})
      .then(errorHandler)
      .then(responseSchemaHandler);
}
