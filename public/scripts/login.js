function login() {
  const username = $(".username-input").val();
  const password = $(".password-input").val();
  if (username === "" || password === "") {
    const alertHtml = `
    <div class="alert alert-danger alert-dismissible fade show" role="alert" id="loginAlertTag">
      Please fill out the fields
    </div>`;
    $(".alert").remove();
    $(".modal-body").prepend(alertHtml);
    return;
  }
  $.post("/account/login", { username, password }, function (data) {
    if (data.status === "success") {
      window.location.href = data.referer;
    } else {
      const alertHtml = `
      <div class="alert alert-danger alert-dismissible fade show" role="alert" id="loginAlertTag">
        Login unsuccessful! Username may not exists, or wrong password.
      </div>`;
      $(".alert").remove();
      $(".modal-body").prepend(alertHtml);
    }
  });
}
function handleKeyPress(event) {
  if (event.keyCode === 13) {
    login();
  }
}
$("#login-form").on("reset", function () {
  // Xóa các thông báo lỗi khi form được reset
  $(".alert").remove();
});

$("#LoginModal").on("hidden.bs.modal", function () {
  // Xóa các thông báo lỗi khi modal được ẩn đi
  $(".alert").remove();
});

$("#LoginModal").on("show.bs.modal", function () {
  // Xóa các thông báo lỗi khi modal được hiển thị
  $(".alert").remove();
});
