import { createSelector } from 'reselect';

const terminalSelector = state => state.terminal;
const contractsSelector = state => state.contracts.current;
const apiKeysSelector = state => state.apiKeys.ownKeys;
const userSelector = state => state.auth.profile;

const groupSelector = createSelector(
  terminalSelector,
  (terminal) => terminal.assetGroup,
);

export const fundsSelector = createSelector(
  contractsSelector,
  apiKeysSelector,
  groupSelector,
  userSelector,
  (contracts, apiKeys, assetGroup, user) => {
    let funds;

    if (assetGroup) {
      funds = contracts.filter((c) => assetGroup.contracts.includes(c._id));
    } else {
      funds = apiKeys.concat(contracts.filter(contract => contract.to._id === user._id));
    }

    return funds;
  },
);
