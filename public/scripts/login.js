function login() {
  const username = $(".username-input").val();
  const password = $(".password-input").val();
  $.post("/login", { username, password }, function (data) {
    if (data.status === "success") {
      window.location.href = data.referer;
    } else {
      alert("Login Unsuccessful!");
    }
  });
}
