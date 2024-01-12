function showAlert(status, message) {
  const alertHtml = `
  <div class="alert alert-${status} alert-dismissible fade show" role="alert">
    ${message}
  </div>`;
  $(".alert").remove();
  $(".modal-body").prepend(alertHtml);
}

function login() {
  const username = $(".username-input").val();
  const password = $(".password-input").val();
  if (username === "" || password === "") {
    showAlert("danger", "Please fill out the fields");
    return;
  }
  $.post("/account/login", { username, password }, function (data) {
    if (data.status === "success") {
      window.location.href = data.referer;
    } else {
      showAlert(
        "danger",
        "Login unsuccessful! Username may not exists, or wrong password"
      );
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
