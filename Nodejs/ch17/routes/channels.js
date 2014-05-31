var config = require('../config');

exports.channels = function() {
  return {
      index: function(req, res) {
        res.redirect('/channels/default');
      }
    , show: function(req, res) {
        res.local('resources', [
            { type: 'javascript', uri: '/socket.io/socket.io.js' }
          , { type: 'css', uri: '/stylesheets/channel.css' }
          , { type: 'javascript', uri: '/javascripts/channel.js' }
          , { type: 'javascript', uri: '/lib/jquery-file-upload/jquery.fileupload.js' }
          , { type: 'javascript', uri: '/lib/masonry/jquery.masonry.min.js' }
          , { type: 'javascript', uri: '/lib/fancybox/source/jquery.fancybox.pack.js' }
          , { type: 'css', uri: '/lib/fancybox/source/jquery.fancybox.css' }
        ]);
        res.local('variables', [
            { name: 'username', value: "'" + req.session.username + "'" }
          , { name: 'channel', value: "'" + req.params.channelName + "'" }
          , { name: 'socketioHost', value: "'" + config.client.socketio.host + "'" }
          , { name: 'socketioPort', value: config.client.socketio.port }
          , { name: 'fileUploadUri', value: "'" + config.client.fileUpload.uri + "'" }
          , { name: 'fileUploadFileSizeLimit', value: config.client.fileUpload.fileSizeLimit }
          , { name: 'fileUploadField', value: "'" + config.client.fileUpload.field + "'" }
          , { name: 'fileUploadExtensions', value: JSON.stringify(config.client.fileUpload.extensions).replace(/\"/g, "'") }
        ]);
        res.render('channel', { channel: req.params.channelName });
      }
  };
};
