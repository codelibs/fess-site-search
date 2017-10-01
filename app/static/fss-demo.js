function load_iframe() {
  $("#iframe").prop("src", function(){
    return $(this).data("src");
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
        $("#loading").hide();
        $("#loaded").show();
        load_iframe();
      } else {
        setTimeout(poll, 200);
      }
    },
    dataType: "json",
    timeout: 2000
  })
}
setTimeout(poll, 200);
