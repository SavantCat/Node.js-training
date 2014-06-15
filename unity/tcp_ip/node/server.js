// TCP�ɂ��G�R�[�N���C�A���g�̎���
var net = require('net');
var readline = require('readline');

var options = {};
options.host = process.argv[2];
options.port = process.argv[3];

var client = net.connect(options);

// �ڑ����s���̃C�x���g
client.on('error', function(e) {
  console.error('Connection Failed - ' + options.host + ':' + options.port);
  console.error(e.message);
});

// �N���C�A���g�\�P�b�g�ڑ��m�����̃C�x���g
client.on('connect', function() {
  console.log('Connected - ' + options.host + ':' + options.port);
});

// Control-c �ŃN���C�A���g�\�P�b�g���N���[�Y�ł���悤�ɂ��܂�
var rl = readline.createInterface(process.stdin, process.stdout);
rl.on('SIGINT', function() {
  console.log('Connection Closed - ' + options.host + ':' + options.port);
  client.end();
  rl.close();
});

// 1�b���Ƃ�timeout����悤�ɐݒ肵��
// 'Hello World' ���T�[�o�ɑ��M
var i = 0;  // ���M����
client.setTimeout(1000);
client.on('timeout', function() {
  var str = i + ': Hello World\n';
  process.stdout.write('[S] ' + str);
  client.write(str);
  i = i + 1;
});

// Echo�o�b�N����Ă����f�[�^��W���o�͂ɕ\��
client.on('data', function(chunk) {
  process.stdout.write(chunk.toString());
});

// �N���C�A���g�\�P�b�g�I�����̃C�x���g
client.on('end', function(had_error) {
  client.setTimeout(0); // �^�C���A�E�g�𖳌���
  console.log('Connection End - ' + options.host + ':' + options.port);
});

client.on('close', function() {
  console.log('Client Closed');
  rl.close();
});
