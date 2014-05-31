var a = 10;
var b = 30;
debugger;

var c = calc(a, b);
debugger;
var b = calc(a, c);
debugger;

console.log(b);

function calc(x, y) {
  var ret = x + y;
  return ret;
}
