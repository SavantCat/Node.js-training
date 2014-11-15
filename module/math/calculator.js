var math_cpp = require('./build/Release/math');

for(var i=0;i<100;i++){
    if (math_cpp.IsPrime(i) == true) {
        console.log(i);
    }
}
