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
        var vueLoad = document.createElement('script');
        vueLoad.type = 'text/javascript';
        vueLoad.async = false;
        vueLoad.src = $('#iframe').contents().find('script#embed').attr('js_path');
        vueLoad.charset = 'utf-8';
        vueLoad.onload = () => {
            console.log("[FSS] Initialize fess-site-search...");
            const app = createApp({
                components: {
                    'fess-search-form': SearchForm,
                    'fess-search-result': SearchResult,
                }
            });
            app.mount('#fess-site-search');
        };
        var s = document.getElementById('iframe').contentDocument.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(vueLoad, s);
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
