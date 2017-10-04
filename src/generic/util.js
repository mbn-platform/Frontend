function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

export const makeId = length => {
  length = length || 24;
  var text = '';
  var possible = "abcdef0123456789";
  for (var i = 0; i < 24; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;

}
