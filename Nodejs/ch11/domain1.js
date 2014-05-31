// try-catch ではエラーが捕獲できない例
var fs = require('fs');
process.on('uncaughtException', function(e) {
  // ここで捕獲される
  console.error('uncaughtException:', e.message);
});
try {
  fs.readFile('non-exist.txt', 'utf8', function(err, data) {
    if (err) throw err; //コールバック中でエラーをスローする
    console.log('data:', data);
  });
} catch (e) {
  // catch でエラーを捕獲できない
  console.error('catch:', e.message);
}
