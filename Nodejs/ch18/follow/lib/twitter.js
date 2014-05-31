var OAuth = require('oauth').OAuth
  , querystring = require('querystring')
  , events = require('events');

module.exports = Twitter;

function Twitter(oauthInfo) {
  if (!oauthInfo) throw new Error('Oauth情報を指定してください');

  this.options = {
    consumer_key       : oauthInfo.consumer_key,
    consumer_secret    : oauthInfo.consumer_secret,
    access_token       : oauthInfo.access_token,
    access_token_secret: oauthInfo.access_token_secret,

    headers: {
      'Accept'    : '*/*',
      'User-Agent': 'node.js book sample'
    },

    request_token_url: 'https://api.twitter.com/oauth/request_token',
    access_token_url : 'https://api.twitter.com/oauth/access_token',
    authorize_url    : 'https://api.twitter.com/oauth/authorize',
    callback_url     : oauthInfo.callback_url,

    restapi_base_url: 'http://api.twitter.com/1/',
    stream_base_url : 'https://stream.twitter.com/1/statuses/'
  };

  this.oauth = new OAuth(
    this.options.request_token_url,
    this.options.access_token_url,
    this.options.consumer_key,
    this.options.consumer_secret,
    '1.0a',
    this.options.callback_url,
    'HMAC-SHA1',
    null,
    this.options.headers
  );
}

Twitter.prototype.streaming = function(method, params, callback) {
  if (typeof params === 'function') {
    callback = params;
    params = null;
  }

  var url = this.options.stream_base_url + method + '.json?' + querystring.stringify(params);
  var stream = new events.EventEmitter();
  var CRLF = '\r\n';
  var CRLF_LENGTH = 2;

  var request = this.oauth.get(
    url,
    this.options.access_token,
    this.options.access_token_secret
  );

  request.on('response', function(response) {
    response.setEncoding('utf8');
    var buffer = '';

    response.on('data', function(chunk) {
      buffer += chunk;
      var index, json;

      while((index = buffer.indexOf(CRLF)) > -1) {
        json = buffer.slice(0, index);
        buffer = buffer.slice(index + CRLF_LENGTH);

        if (json.length > 0) {
          try {
            stream.emit('data', JSON.parse(json));
          } catch (error) {
            stream.emit('error', new Error('Parse Error: ' + error.message));
          }
        }
      }
    });
    response.on('end', function() {
      stream.emit('end');
    });
  });
  request.end();

  callback(stream);
  return this;
}

Twitter.prototype.friendships = function(method, params, callback) {
  if (['create', 'destroy'].indexOf(method) !== -1) {
    var url = this.options.restapi_base_url + 'friendships/' + method + '.json';
    this.oauth.post(
      url,
      this.options.access_token,
      this.options.access_token_secret,
      params,
      callback
    );
  } else if (['exists', 'show', 'incoming', 'outgoing'].indexOf(method) !== -1) {
    var url = this.options.restapi_base_url + 'friendships/' + method + '.json' + querystring.stringify(params);
    this.oauth.get(
      url,
      this.options.access_token,
      this.options.access_token_secret,
      callback
    );
  } else {
    callback(new Error('No such method.'));
  }
}
