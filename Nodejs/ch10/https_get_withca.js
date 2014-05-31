// CA設定向けHTTPSクライアント
var https = require('https');
var fs = require('fs');
var port = 1338;
var ca_cert = fs.readFileSync('foo-cert.pem');
// globalAgent利用時
var options1 = {host: 'foo', port: port, ca: ca_cert};
var req1 = https.get(options1, function(res) {
  console.log('1: globalAgent: SSL Authorization', req1.connection.authorized);
});
// カスタムエージェント利用時
var agent = new https.Agent({ca: ca_cert});
var options2 = {host: 'foo', port: port, agent: agent};
var req2 = https.get(options2, function(res) {
  console.log('2: customAgent: SSL Authorization', req2.connection.authorized);
});
// エージェント非利用時
var options3 = {host: 'foo', port: port, ca: ca_cert, agent: false};
var req3 = https.get(options3, function(res) {
  console.log('3: No Agent: SSL Authorization', req3.connection.authorized);
});
