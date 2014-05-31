var Greeting = require('./build/Release/greeting').Greeting;
var greeting = new Greeting();
console.log(greeting.hello('Japan'));
