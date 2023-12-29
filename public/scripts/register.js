function register() {
  const username = $(".username-input-reg").val();
  const name = $(".name-input-reg").val();
  const password = $(".password-input-reg").val();
  const confirmPassword = $(".passwordConfirm-input-reg").val();
  if (password !== confirmPassword) {
    alert("Password and confirm password do not match!");
  } else {
    $.post("/register", { username, name, password }, function (data) {
      if (data.status === "fail") {
        alert(data.message);
      } else {
        alert(data.message);
        $.post("/login", { username, password }, function (data) {
          if (data.status === "success") {
            window.location.href = data.referer;
          } else {
            alert("Login Unsuccessful!");
          }
        });
      }
    });
  }
}
