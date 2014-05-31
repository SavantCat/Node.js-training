var socket = null
  , files = [];

$(document).ready(function() {
  setUpFileUpload();
  setUpSocketIo();
});

function setUpFileUpload() {
  $('#progressBar').progressbar({ value: 0 });

  $('#fileUploader').fileUpload({
      url: fileUploadUri
    , method: 'POST'
    , fieldName: fileUploadField
    , multipart: true
    , multiFileRequest: false
    , dropZone: $('#fileUploaderDropZone')
    , initUpload: function(event, files, index, xhr, uploadSettings, uploadFunction) {
        var message = checkFileAllowed(files[index]);
        if (message != null) {
          alert(message);
          return;
        }

        $.extend(uploadSettings, {
          formData: function() {
            return [
              { name: 'to', value: channel },
            ]
          }
        });

        showProgressBar(true);
        uploadFunction();
      }
    , onDocumentDragEnter: function(event) {
        $('#fileUploaderDropZone').css('height', '100%');
      }
    , onDragLeave: function(event) {
        $('#fileUploaderDropZone').css('height', '0%');
      }
    , onDrop: function(event) {
        $('#fileUploaderDropZone').animate({ 'height': 0 }, 200);
      }
    , onProgress: function(event, files, index, xhr, settings) {
        var percentage = Math.floor((event.loaded / event.total) * 100.0);
        $('#progressBar').progressbar('option', 'value', percentage);
      }
    , onLoad: function(event, files, index, xhr, settings) {
        $('#progressBar').progressbar('option', 'value', 100);
        showProgressBar(false);
      }
    , onAbort: function(event, files, index, xhr, settings) {
        showProgressBar(false);
      }
    , onError: function(event, files, index, xhr, settings) {
        showProgressBar(false);
      }
  });
}

function setUpSocketIo() {
  socket = io.connect(
    socketioHost,
    { port: socketioPort, transports: ['websocket'] }
  ); 
  socket.on('connect', function() {
    socket.json.emit('greeting', { username: username, channel: channel })
  });
  socket.on('file', function(message) {
    addFileToWall(message);
  });
  socket.on('users', function(message) {
    updateUsers(message);
  });
}

function addFileToWall(message) {
  var fileId = 'file-' + message.id;

  var $element = $(document.createElement('div'));
  $element.addClass('box');

  var $anchor = $(document.createElement('a'));
  $anchor.attr('id', fileId + '-fancy');
  $anchor.attr('href', '#' + fileId + '-file');
  $anchor.attr('title', message.fileName + ' from ' + message.from);
  $element.append($anchor);

  var $thumbnail = $(document.createElement('img'));
  $thumbnail.attr('src', 'data:' + message.contentType + ';base64,' + message.data);
  $thumbnail.addClass('fileThumbnail');
  $anchor.append($thumbnail);

  var $wrapper = $(document.createElement('div'));
  $wrapper.attr('style', 'display: none');
  $element.append($wrapper);

  var $image = $(document.createElement('img'));
  $image.attr('id', fileId + '-file');
  $image.addClass('fileOriginal');
  $image.attr('src', 'data:' + message.contentType + ';base64,' + message.data);
  $wrapper.append($image);

  var $label = $(document.createElement('div'));
  $label.addClass('fileLabel');
  $label.text(message.from);
  $element.append($label);
  $element.hide();

  $element.fadeIn(1000);
  $anchor.fancybox({
      transitionIn: 'fade'
    , transitionOut: 'fade'
    , speedIn: 200
    , speedOut: 200
    , hideOnContentClick: true
    , titlePosition: 'inside'
  });

  $('#fileWall').prepend($element);
  $('#fileWall').masonry(
    { singleMode: true, itemSelector: '.box:visible' }
  );
}

function updateUsers(message) {
  var $element = $('#channelNumberOfUsers');
  $element.text(message.count);
}

function showProgressBar(visible) {
  var $progressBarContainer = $('#progressBarContainer');
  if (visible) {
    $progressBarContainer.show('blind', {}, 300);
  } else {
    setTimeout(function() { $progressBarContainer.hide('blind', {}, 300) }, 2000);
  }
}

function checkFileAllowed(file) {
  var message = null;

  if (file.name) {
    var isAllowed = false
      , supportedExtensions = '';

    var extension = file.name.split('.').pop();
    fileUploadExtensions.forEach(function(element) {
      if (extension.toLocaleLowerCase() == element.toLocaleLowerCase()) {
        isAllowed = true;
      }

      if (supportedExtensions != '') {
        supportedExtensions += ', ';
      }
      supportedExtensions += element;
    });

    if (!isAllowed) {
      message = 'File type is not supported! Supported types are ' +
        supportedExtensions + '.';
    }
  }
  if ((file.size) && (file.size >= fileUploadFileSizeLimit)) {
    message = 'File size is too large! It has to be less than ' +
      fileUploadFileSizeLimit + ' bytes.';
  }

  return message;
}
