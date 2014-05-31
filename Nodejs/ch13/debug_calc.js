var a = 10;
var b = 30;

var c = calc(a, b);
var b = calc(a, c);

console.log(b);

function calc(x, y) {
  var ret = x + y;
  return ret;
}
