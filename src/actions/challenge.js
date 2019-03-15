import { ApiChallenge} from '../generic/api';
import {leaderboardErrorHandler} from '../generic/errorHandlers';
import {showInfoModal} from './modal';

export const UPDATE_CHALLENGE = 'UPDATE_CHALLENGE';
export const NEXT_STATUS = 'NEXT_STATUS';
export const NEXT_PARTICIPATE = 'NEXT_PARTICIPATE';

const ChallengeApi = new ApiChallenge();

export const updateChallenge = number => {
  return dispatch => {
    ChallengeApi.update(number)
      .then(data => {
        dispatch({
          type: UPDATE_CHALLENGE,
          challenge: data,
        });
      })
      .catch(err =>
        leaderboardErrorHandler(err, dispatch));
  };
};

export const getNextInfo = () => {
  return (dispatch, state) => {
    ChallengeApi.getNextInfo()
      .then(data => {
        dispatch({
          type: NEXT_STATUS,
          next: data,
        });
      })
      .catch(err => {
        console.log(err);
      });
  };
};

export const takePart = () => {
  return dispatch => {
    ChallengeApi.takePart()
      .then(data => {
        dispatch({
          type: NEXT_PARTICIPATE,
        });
      })
      .catch(err => {
        console.log(err);
      });
  };
};

export const applyForContract = (id) => {
  return (dispatch, getState) => {
    const web3 = window.web3;
    const state = getState();
    const address = state.auth.profile.address;
    web3.version.getNetwork((err, code) => {
      if (err) {
        alert('web3 error: no network');
        return;
      }
      if (code !== '1') {
        alert('Please select main net in Metamask');
        return;
      }
      web3.eth.getAccounts((err, a) => {
        if (err) {
          alert(err);
          return;
        }
        if (a[0].toLowerCase() !== address) {
          dispatch(showInfoModal('modal.error', {}, {textId: 'modal.error.useYourAddress'}));
          return;
        }
        ChallengeApi.applyForContract(id)
          .then(data => {
            window.web3.eth.sendTransaction({
              from: address,
              to: data.address,
              value: data.deposit,
              gas: '21000',
            }, (err, tx) => {
              if (err) {
                if (/denied transaction/.test(err.message)) {
                  dispatch(
                    showInfoModal('modal.error', {}, {textId: 'modal.error.deniedContractPay'}),
                  );
                }
                return;
              }
              ChallengeApi.confirmDepositTx(id, tx)
                .then(() => {
                  dispatch(showInfoModal('modal.success', {}, {textId: 'leaderboard.txAccepted'}));
                });
            });
          })
          .catch(err => {
            switch (err.apiErrorCode) {
              case 'expired':
                dispatch(showInfoModal('modal.error', {},
                  {textId: 'modal.error.contractNotAvailable'},
                ));
                break;
              default:
                break;
            }
          });
      });
    });
  };
};
