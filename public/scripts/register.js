function register() {
  const username = $(".username-input-reg").val();
  const name = $(".name-input-reg").val();
  const password = $(".password-input-reg").val();
  const confirmPassword = $(".passwordConfirm-input-reg").val();

  if (
    username === "" ||
    name === "" ||
    password === "" ||
    confirmPassword === ""
  ) {
    const alertHtml = `
    <div class="alert alert-danger alert-dismissible fade show" role="alert">
      Please fill out the form
    </div>`;
    $(".alert").remove();
    $(".modal-body").prepend(alertHtml);
    return;
  }

  if (password !== confirmPassword) {
    const alertHtml = `
    <div class="alert alert-danger alert-dismissible fade show" role="alert">
      Password and confirm password do not match.
    </div>`;
    $(".alert").remove();
    $(".modal-body").prepend(alertHtml);
  } else {
    $.post("/account/register", { username, name, password }, function (data) {
      if (data.status === "fail") {
        const alertHtml = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
          Username has been taken
        </div>`;
        $(".alert").remove();
        $(".modal-body").prepend(alertHtml);
      } else {
        $.post("/account/login", { username, password }, function (data) {
          window.location.href = data.referer;
        });
      }
    });
  }
}

$("#regiser-form").on("reset", function () {
  // Xóa các thông báo lỗi khi form được reset
  $(".alert").remove();
});
$("#RegisterModal").on("hidden.bs.modal", function () {
  // Xóa các thông báo lỗi khi modal được ẩn đi
  $(".alert").remove();
});

$("#RegisterModal").on("show.bs.modal", function () {
  // Xóa các thông báo lỗi khi modal được hiển thị
  $(".alert").remove();
});
