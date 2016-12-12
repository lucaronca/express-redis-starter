$(document).ready(function(){

  $('.upload-btn').on('click', function (){
      $('#upload-input').click();
      $('label[for="progress"]').text('0%');
      $('.progress .meter').width('0%');
  });

  $('#upload-input').on('change', function(){

    var files = $(this)[0].files;

    if (files.length > 0){
      // create a FormData object which will be sent as the data payload in the
      // AJAX request
      var formData = new FormData();

      // loop through all the selected files and add them to the formData object
      for (var i = 0; i < files.length; i++) {
        var file = files[i];

        // add the files to formData object for the data payload
        formData.append('uploads', file, file.name);

        // adding other fields to formData
        formData.append('name', $('.name input').val());
        formData.append('month', $('.month select').val());
        formData.append('year', $('.year input').val());

      }

      $.ajax({
        url: '/upload/send',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function(data){
            console.log('upload successful!\n' + data);
        },
        xhr: function() {
          // create an XMLHttpRequest
          var xhr = new XMLHttpRequest();

          // listen to the 'progress' event
          xhr.upload.addEventListener('progress', function(evt) {

            if (evt.lengthComputable) {
              // calculate the percentage of upload completed
              var percentComplete = evt.loaded / evt.total;
              percentComplete = parseInt(percentComplete * 100);

              // update the progress bar with the new percentage
              $('label[for="progress"]').text(percentComplete + '%');
              $('.progress .meter').width(percentComplete + '%');

              // once the upload reaches 100%, set the progress bar text to done
              if (percentComplete === 100) {
                $('label[for="progress"]').html('Done');
              }

            }

          }, false);

          return xhr;
        }
      });

    }
  });
  
});


