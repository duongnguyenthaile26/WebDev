function logout() {
  $.post("/account/logout", function (data) {
    if (data.err) {
      alert(data.err);
    } else {
      window.location.href = data.referer;
    }
  });
}
