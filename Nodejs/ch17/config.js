/**
 *  * config
 *   */
exports.server = {
    host: 'localhost'
  , port: 3000
  , session: {
        secret: 'fileupload'
    }
  , uploadPath: './uploads'
};

exports.client = {
    socketio: {
        host: 'localhost'
      , port: 3000
    }
  , fileUpload: {
        uri: '/files'
      , fileSizeLimit: Math.pow(2, 20)
      , field: 'file'
      , extensions: ['jpg', 'png', 'gif']
    }
};

exports.storage = {
    host: 'localhost'
  , port: 5984
  , databases: {
        files: 'fileupload_files'
    }
  , filesPerChannel: 5
};
