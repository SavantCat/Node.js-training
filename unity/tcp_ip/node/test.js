var n = [];
n.push([1,2]);
 console.log(n);
n.push([3,4]);
 console.log(n);
  console.log(n[0][1]);
n[0].push(5000);
 console.log(n);
 try {
 var json = '{"ito":"mizky","hosaka":"takaky","age":27';
var obj = JSON.parse(json);
 console.log(obj);
 }catch (e) {
   console.log("error"); 
 }
 
 
  for(var i in n) {
    console.log(n[i][1])
  }