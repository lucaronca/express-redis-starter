$(document).ready(() => {

    let form = $('.log-in-form').parent()

    $('.log-in-form a[type="submit"]').on('click', () => {

        form.submit();

    });

});
