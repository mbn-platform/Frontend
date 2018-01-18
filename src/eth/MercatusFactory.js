export const ABI = [
  {
    "constant": false,
    "inputs": [
      {
        "name": "_duration",
        "type": "uint256"
      },
      {
        "name": "_maxLoss",
        "type": "uint256"
      },
      {
        "name": "_startBalance",
        "type": "uint256"
      },
      {
        "name": "_targetBalance",
        "type": "uint256"
      },
      {
        "name": "_amount",
        "type": "uint256"
      },
      {
        "name": "_investor",
        "type": "string"
      },
      {
        "name": "_investorAddress",
        "type": "address"
      },
      {
        "name": "_trader",
        "type": "string"
      },
      {
        "name": "_traderAddress",
        "type": "address"
      },
      {
        "name": "offer",
        "type": "uint256"
      },
      {
        "name": "_currency",
        "type": "uint256"
      }
    ],
    "name": "makeInstance",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "instance",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "start",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "offer",
        "type": "uint256"
      }
    ],
    "name": "spawnInstance",
    "type": "event"
  }
];

export const ADDRESS = '0xc4d5335e87b220a172ec48ff3ef07394f887adfd';
