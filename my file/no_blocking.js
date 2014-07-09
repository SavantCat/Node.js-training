console.log("START!!");

setTimeout(function(){
	console.log("call back");
},1000);
console.log("B");

var start = new Date().getTime();
while (new Date().getTime() < start + 100) {
	//console.log(start + " ::: " + new Date().getTime());
	console.log("Blocking");
}
console.log("end");