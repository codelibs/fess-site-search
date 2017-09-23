function loading() {
  $("#loading").show();
  $("#form").hide();
}

function cancel() {
  $("#cbutton").prop("disabled", true);
  $("#ctext").text("Stopping Job...");
  window.location.reload();
}
