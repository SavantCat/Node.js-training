var fs = require('fs');

fs.unlink('previous.txt', function(err) {
  if (err) {
    throw err;
  } else {
    fs.rename('current.txt', 'previous.txt', function(err) {
      if (err) {
        throw err;
      } else {
        fs.rename('new.txt', 'current.txt', function(err) {
          if (err) {
            throw err;
          } else {
            console.log('success');
          }
        });
      }
    });
  }
});
