export const UPDATE_PROFILE = 'UPDATE_PROFILE';

export function updateProfile(profile) {
  const name = profile.name;
  delete profile.name;
  console.log('updateing profile');
  window.fetch('/api/profile/' + name, {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'put',
    credentials: 'same-origin',
    body: JSON.stringify(profile),
  }).then(res => res.json())
    .then(json => {
      console.log(json);
    });
}

