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
    console.log(n[0].length)
  }
  
  
 console.log( isFinite("1") );
  console.log( n.length );
 n["1"-1].push(5000);
 console.log(n);
 
 if (1 == '1') {
     console.log("ok");
 }
 
var t = null;
  if (t == null) {
     console.log(t);
     t = [[1,2]];
     console.log(t);     
 }
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 