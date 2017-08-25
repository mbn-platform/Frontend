export const LOGGED_OUT = 'LOGGED_OUT';
export const LOGGED_IN = 'LOGGED_IN';
export const SET_NICKNAME = 'SET_NICKNAME';

export function logIn() {
  return dispatch => {
    window.web3.eth.getAccounts((err, accounts) => {
      const acc = accounts[0];
      if(!acc) {
        alert('no active acc11');
        return;
      }
      const message = window.web3.sha3('MercatusLogin');
      window.web3.eth.sign(acc, message, (err, result) => {
        if(!err) {
          window.fetch('/api/auth', {
            credentials: 'same-origin',
            method: 'post',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({sgn: result, addr: acc})
          }).then(res => res.json())
            .then(json => dispatch({
              type: LOGGED_IN,
              data: json
            }))
            .catch(err => console.log(err));
        }
      });
    });
  };
}

export function setNickname(nickname) {
  return dispatch => {
    dispatch({
      type: SET_NICKNAME,
      nickname: nickname
    });
  }
}

