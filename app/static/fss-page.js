function loading() {
  $("#loading").show();
  $("#form").hide();
}

function cancel() {
  $("#cbutton").prop("disabled", true);
  $("#ctext").text("Canceling Job...");
  window.location.reload();
}
