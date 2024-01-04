function profile() {
  $.post("/account/profile", function (data) {
    if (data.err) {
      alert(data.err);
    } else {
      window.location.href = "/profile";
    }
  });
}
