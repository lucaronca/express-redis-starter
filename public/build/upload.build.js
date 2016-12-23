webpackJsonp([1,3],{

/***/ 6:
/***/ function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ },

/***/ 8:
/***/ function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {// jQuery
const $ = __webpack_require__(3);
global.jQuery = $;

// Foundation
__webpack_require__(1);
__webpack_require__(2);
__webpack_require__(0);

//Foundation icons
//require('foundation-icons/foundation-icons.scss');

// Section styles
__webpack_require__(6);

$(document).ready(function () {

  $(this).foundation();

  let form = $("#upload-form");

  $('.upload-btn').on('click', function () {
    form.foundation('validateForm');
  });

  $(this).bind('invalid.zf.abide', function (ev, elem) {
    $(elem).parents('fieldset').find('.form-error').show();
  }).bind('valid.zf.abide', function (ev, elem) {
    $(elem).parents('fieldset').find('.form-error').hide();
  });

  // stop default form submit and handle it with zf adibe
  form.bind('submit', function (e) {
    e.preventDefault();
    console.log('submit intercepted');
    return false;
  }).bind('forminvalid.zf.abide', function (e, elem) {
    console.log('form is invalid');
  }).bind('formvalid.zf.abide', function (e, elem) {
    $('#upload-input').click();
    $('label[for="progress"]').text('0%');
    $('.progress .meter').width('0%');
  });

  $('#upload-input').on('change', function () {

    let files = $(this)[0].files;

    if (files.length > 0) {
      // create a FormData object which will be sent as the data payload in the
      // AJAX request
      let formData = new FormData();

      // loop through all the selected files and add them to the formData object
      for (let i = 0; i < files.length; i++) {
        let file = files[i];

        // add the files to formData object for the data payload
        formData.append('uploads', file, file.name);

        // adding other fields to formData
        formData.append('title', $('.title input').val());
        formData.append('month', $('.month select').val());
        formData.append('year', $('.year input').val());
        formData.append('description', $('.description textarea').val());
      }

      $.ajax({
        url: '/upload/send',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function (data) {
          console.log('upload successful!\n' + data);
        },
        xhr: function () {
          // create an XMLHttpRequest
          let xhr = new XMLHttpRequest();

          // listen to the 'progress' event
          xhr.upload.addEventListener('progress', function (evt) {

            if (evt.lengthComputable) {
              // calculate the percentage of upload completed
              let percentComplete = evt.loaded / evt.total;
              percentComplete = parseInt(percentComplete * 100);

              // update the progress bar with the new percentage
              let progress = $('label[for="progress"]');
              progress.text(percentComplete + '%');
              $('.progress .meter').width(percentComplete + '%');

              // once the upload reaches 100%, set the progress bar text to done
              if (percentComplete === 100) {
                progress.html('Done');
              }
            }
          }, false);

          return xhr;
        }
      });
    }
  });
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }

},[8]);
//# sourceMappingURL=upload.build.js.map