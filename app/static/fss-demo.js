window.addEventListener('beforeunload', e => {
    const confirmationMessage = 'data you have entered may not be saved';
    e.returnValue = confirmationMessage;     // Gecko and Trident
    return confirmationMessage;              // Gecko and WebKit
});

function loadIframe() {
    $('#iframe').prop('src', function(){
        return $(this).data('src');
    });
}

function poll() {
    const path = location.pathname;
    const idx = path.lastIndexOf('/');
    const hash = path.substr(idx);
    $.ajax({
        url: '/api/check_js' + hash,
        type: 'GET',
        success: function(data) {
            if (data['result']) {
                $('#loading').hide();
                $('#loading-text').hide();

                $('#loaded').show();
                $('#loaded-text').show();
                loadIframe();
            } else {
                setTimeout(poll, 200);
            }
        },
        dataType: 'json',
        timeout: 2000
    });
}
setTimeout(poll, 200);
