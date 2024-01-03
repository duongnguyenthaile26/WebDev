function login() {
  const username = $(".username-input").val();
  const password = $(".password-input").val();
  if (username === "" || password === "") {
    return;
  }
  $.post("/account/login", { username, password }, function (data) {
    if (data.status === "success") {
      window.location.href = data.referer;
    } else {
      if ($("#loginAlertTag").length > 0) {
        return;
      }
      //alert("Login unsuccessful! Username may not exists, or wrong password");
      const alertHtml = `<div class="alert alert-danger alert-dismissible fade show" role="alert" id="loginAlertTag">
      Login unsuccessful! Username may not exists, or wrong password.
                          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>`;
      $(".modal-body").prepend(alertHtml);
    }
  });
}
$("#login-form").on("reset", function () {
  // Xóa các thông báo lỗi khi form được reset
  $(".alert").alert("close");
});
$("#LoginModal").on("hidden.bs.modal", function () {
  // Xóa các thông báo lỗi khi modal được ẩn đi
  $(".alert").alert("close");
});

$("#LoginModal").on("show.bs.modal", function () {
  // Xóa các thông báo lỗi khi modal được hiển thị
  $(".alert").alert("close");
});

// Xử lý sự kiện submit của form
$("#login-form").submit(function (event) {
  event.preventDefault();
  if ($("#login-form")[0].checkValidity() === false) {
    // Nếu form không hợp lệ, ngăn chặn việc submit và hiển thị thông báo lỗi
    event.stopPropagation();
  }
  // Đánh dấu các input đã được kiểm tra validation
  $("#login-form").addClass("was-validated");
});
