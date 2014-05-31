var size = 16;
var buf = new Buffer(size);
var arr = [1,2,3,4,5,6];
var arrayBuf = new Buffer(arr);
var str = "sample";
var stringBuf = new Buffer(str);

console.log(buf);
console.log(arrayBuf);
console.log(stringBuf);
