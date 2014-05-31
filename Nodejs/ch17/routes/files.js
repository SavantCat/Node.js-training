var fs = require('fs')
  , config = require('../config');

exports.files = function(dataHandler, clientHandler) {
  return {
      create: function(req, res) {
        var from = req.session.username
          , to = req.param('to')
          , fileField = config.client.fileUpload.field
          , file = req.files[fileField];

        dataHandler.saveFile(
            file.path
          , file.type
          , file.name
          , from
          , to
          , function(error, response) {
              var isError = (error) ? true : false;
              var message = (isError) ? 'Failed to upload.' : 'Uploaded!';
              res.send(JSON.stringify(
                { type: 'response', content: { error: isError, message: message } }
              ));

              fs.unlink(file.path);
              if (!isError) {
                clientHandler.sendFileToChannel(from, to, response.id);
              }
            }
        );
      }
    , show: function(req, res) {
        var path = config.server.uploadPath + '/' + req.params.fileName;
        res.download(path, req.params.fileName, function(err) {
          if (err) {
            res.send('Failed to download ' + req.params.fileName);
          }
        });
      }
  };
};
