window.addEventListener('beforeunload', e => {
    const confirmationMessage = 'data you have entered may not be saved';
    e.returnValue = confirmationMessage;     // Gecko and Trident
    return confirmationMessage;              // Gecko and WebKit
});

function loadIframe() {
    $('#iframe').prop('src', function(){
        return $(this).data('src');
    });
    $('#iframe').on('load', function() {
        var fess = document.createElement('script');
        fess.type = 'text/javascript';
        fess.async = true;
        fess.src = $('#iframe').contents().find('script#embed').attr('js_path');
        fess.charset = 'utf-8';
        fess.setAttribute('id', 'fess-ss');
        fess.setAttribute('fess-url', 'https://search.n2sm.co.jp/json');
        fess.setAttribute('fess-search-page-path', $('#iframe').contents().find('script#embed').attr('page_path'));
        var s = document.getElementById('iframe').contentDocument.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(fess, s);
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
