export const ABI = [
  {
    'constant': false,
    'inputs': [
      {
        'name': '_be',
        'type': 'address'
      },
      {
        'name': '_deadline',
        'type': 'uint256'
      },
      {
        'name': '_maxLoss',
        'type': 'uint256'
      },
      {
        'name': '_startBallance',
        'type': 'uint256'
      },
      {
        'name': '_targetBallance',
        'type': 'uint256'
      },
      {
        'name': '_amount',
        'type': 'uint256'
      },
      {
        'name': '_invester',
        'type': 'string'
      },
      {
        'name': '_investerAddress',
        'type': 'address'
      },
      {
        'name': '_trader',
        'type': 'string'
      },
      {
        'name': '_traderAddress',
        'type': 'address'
      },
      {
        'name': 'offer',
        'type': 'uint256'
      }
    ],
    'name': 'makeInstance',
    'outputs': [
      {
        'name': '',
        'type': 'address'
      }
    ],
    'payable': true,
    'type': 'function'
  },
  {
    'anonymous': false,
    'inputs': [
      {
        'indexed': true,
        'name': 'from',
        'type': 'address'
      },
      {
        'indexed': true,
        'name': 'instance',
        'type': 'address'
      },
      {
        'indexed': false,
        'name': 'offer',
        'type': 'uint256'
      }
    ],
    'name': 'spawnInstance',
    'type': 'event'
  }
];

export const ADDRESS = '0xd9505442710f02ead1e50bdbc33abd0eb38ea435';
