function logout() {
  $.get("/logout", function (data) {
    if (data.err) {
      alert(data.err);
    } else {
      window.location.href = data.referer;
    }
  });
}
