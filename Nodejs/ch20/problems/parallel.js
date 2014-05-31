var databaseData = null;
var fileData = null;

function readFromDatabase(callback) {
  setTimeout(function() {
    callback(null, 'data from database');
  }, 5000);
}

function readFromFile(callback) {
  setTimeout(function() {
    callback(null, 'data from file');
  }, 3000);
}

function checkIfAllDone() {
  if ((databaseData === null) || (fileData === null)) {
    setTimeout(checkIfAllDone, 100);
  } else {
    console.log('all done: "%s" and "%s"', databaseData, fileData);
  }
}

readFromDatabase(function(err, data) {
  databaseData = data;
});
readFromFile(function(err, data) {
  fileData = data;
});
checkIfAllDone();
