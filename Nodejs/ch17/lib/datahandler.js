/**
 * datahandler
 */
var fs = require('fs')
  , cradle = require('cradle');

var MAXIMUM_NUMBER_OF_UUIDS = 10
  , noop = function() {};

function DataHandler(config) {
  this._config = config;
  this._uuids = [];
}

DataHandler.prototype._getConnection = function() {
  return new(cradle.Connection)(
    this._config.host,
    this._config.port,
    { cache: true, raw: false }
  );
};

DataHandler.prototype._getDatabase = function(database) {
  return this._getConnection().database(database);
};

DataHandler.prototype._getUuids = function(count, callback) {
  callback = callback || noop;

  var connection = this._getConnection();
  connection.uuids(count, callback);
};

DataHandler.prototype._fillUuids = function(callback) {
  var that = this;
  callback = callback || noop;

  if (this._uuids.length <= 0) {
    this._getUuids(MAXIMUM_NUMBER_OF_UUIDS, function(err, res) {
      if (err) {
        callback(err);
      } else {
        for (var index = 0; index < res.length; index++) {
          that._uuids.push(res[index]);
        }
        callback(null, true);
      }
    });
  } else {
    callback(null, true);
  }
};

DataHandler.prototype._prepareToSaveFile = function(to, callback) {
  var that = this;
  callback = callback || noop;

  var database = this._getDatabase(this._config.databases.files);
  database.view('files/count', { group: true, key: to }, function(err, res) {
    if (err) {
      callback('Failed to get a number of files saved for channel: ' + to);
    } else {
      if (res.length == 1) {
        var count = res[0].value
          , filesToDelete = (count - that._config.filesPerChannel) + 1;

        that._deleteOldFiles(to, filesToDelete, callback);
      } else {
        callback(null, true);
      }
    }
  });
};

DataHandler.prototype._deleteOldFiles = function(channel, numberOfFiles, callback) {
  callback = callback || noop;

  if (numberOfFiles > 0) {
    var database = this._getDatabase(this._config.databases.files);
    database.view(
        'files/byTo'
      , { startkey: [channel], endkey: [channel, {}], limit: numberOfFiles }
      , function(err, res) {
          if (err) {
            callback(err);
          } else {
            database.save(
              res.map(function(row) {
                return { '_id': row._id, '_rev': row._rev, '_deleted': true }
              }),
              callback
            );
          }
        }
    );
  } else {
    callback(null, true);
  }
};

DataHandler.prototype._saveFile = function(path, contentType, name, from, to, callback) {
  var that = this;
  callback = callback || noop;

  fs.readFile(path, function(err, data) {
    if (err) {
      callback(err);
    } else {
      var database = that._getDatabase(that._config.databases.files)
        , id = that._uuids.shift();

      database.save(
          id
        , {
            name: name,
            from: from,
            to: to,
            uploaded: Date.now(),
            _attachments: {
              attachment: { content_type: contentType, data: data.toString('base64')}
            }
          }
        , callback
      );
    }
  });
};

DataHandler.prototype.saveFile = function(path, contentType, name, from, to, callback) {
  var that = this;
  callback = callback || noop;

  this._fillUuids(function(err, res) {
    if (err) {
      callback('failed to fill uuids.');
    } else {
      that._prepareToSaveFile(to, function(error, response) {
        if (error) {
          callback(error);
        } else {
          that._saveFile(path, contentType, name, from, to, callback);
        }
      });
    }
  });
};

DataHandler.prototype.getFileList = function(to, callback) {
  callback = callback || noop;

  var database = this._getDatabase(this._config.databases.files);
  database.view('files/byTo', { startkey: [to], endkey: [to, {}] }, function(err, res) {
    if (err) {
      callback('failed to get files.');
    } else {
      callback(null, res);
    }
  });
};

DataHandler.prototype.getFile = function(id, callback) {
  callback = callback || noop;

  var database = this._getDatabase(this._config.databases.files);
  database.query('GET', '/' + id, { attachments: true }, null, { Accept: 'application/json' }, function(err, res) {
    if (err) {
      return callback(err);
    }
    if (!res._attachments || !res._attachments.attachment) {
      return callback('Attachment is missing: ' + id);
    }
    callback(null, {
        id: res._id
      , fileName: res.name
      , data: res._attachments.attachment.data
      , contentType: res._attachments.attachment.content_type
    });
  });
};

exports.DataHandler = DataHandler;
