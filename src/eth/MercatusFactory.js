export const ABI = [
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "deals",
    "outputs": [
      {
        "name": "currentState",
        "type": "uint8"
      },
      {
        "name": "start",
        "type": "uint256"
      },
      {
        "name": "deadline",
        "type": "uint256"
      },
      {
        "name": "maxLoss",
        "type": "uint256"
      },
      {
        "name": "startBalance",
        "type": "uint256"
      },
      {
        "name": "targetBalance",
        "type": "uint256"
      },
      {
        "name": "amount",
        "type": "uint256"
      },
      {
        "name": "currency",
        "type": "uint8"
      },
      {
        "name": "investor",
        "type": "string"
      },
      {
        "name": "investorAddress",
        "type": "address"
      },
      {
        "name": "trader",
        "type": "string"
      },
      {
        "name": "traderAddress",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "dealId",
        "type": "uint256"
      }
    ],
    "name": "setHalted",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "dealId",
        "type": "uint256"
      }
    ],
    "name": "setVerified",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "dealId",
        "type": "uint256"
      }
    ],
    "name": "getState",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "dealId",
        "type": "uint256"
      },
      {
        "name": "finishAmount",
        "type": "uint256"
      }
    ],
    "name": "setFinished",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "be",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getDealsCount",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "dealId",
        "type": "uint256"
      }
    ],
    "name": "getStart",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
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
    "name": "makeDeal",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "constructor"
  },
  {
    "payable": true,
    "stateMutability": "payable",
    "type": "fallback"
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
        "name": "dealId",
        "type": "uint256"
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

export const ADDRESS = '0x849b42447aa2b163d4dd34062342affff47ce92d';
export const MAIN_NET_ADDRESS = '0xcabdff9789c92ac0f8a02b820c3148f15b61ea9b';
