function login() {
  const username = $(".username-input").val();
  const password = $(".password-input").val();
  $.post("/account/login", { username, password }, function (data) {
    if (data.status === "success") {
      window.location.href = data.referer;
    } else {
      alert("Login unsuccessful! Username may not exists, or wrong password");
    }
  });
}
