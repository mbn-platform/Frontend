export const ABI = [
  {
    'constant': true,
    'inputs': [],
    'name': 'name',
    'outputs': [
      {
        'name': '',
        'type': 'string'
      }
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'constant': true,
    'inputs': [
      {
        'name': 'owner',
        'type': 'address'
      }
    ],
    'name': 'balanceOf',
    'outputs': [
      {
        'name': '',
        'type': 'uint256'
      }
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'constant': false,
    'inputs': [
      {
        'name': 'to',
        'type': 'address'
      },
      {
        'name': 'value',
        'type': 'uint256'
      }
    ],
    'name': 'transfer',
    'outputs': [
      {
        'name': '',
        'type': 'bool'
      }
    ],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function'
  },
];

window.mbnTransfer = transfer;

export const ADDRESS = process.env.REACT_APP_MBN_TOKEN_ADDRESS;

export function transfer(to, amount) {
  return new Promise((res, rej) => {
    const contract = window.web3.eth.contract(ABI).at(ADDRESS);
    contract.transfer(to, amount, (err, tx) => {
      if (err) {
        rej(err);
      } else {
        res(tx);
      }
    });
  });
}
