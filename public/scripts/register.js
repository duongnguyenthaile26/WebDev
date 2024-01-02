function register() {
  const username = $(".username-input-reg").val();
  const name = $(".name-input-reg").val();
  const password = $(".password-input-reg").val();
  const confirmPassword = $(".passwordConfirm-input-reg").val();
  if (password !== confirmPassword) {
    //alert("Password and confirm password do not match!");
    const alertHtml = `<div class="alert alert-danger alert-dismissible fade show" role="alert">
    Password and confirm password do not match.
                          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>`;
      $(".modal-body").prepend(alertHtml); // Thêm thông báo lỗi vào đầu modal
  } else {
    $.post("/account/register", { username, name, password }, function (data) {
      if (data.status === "fail") {
        alert(data.message);
      } else {
        // alert(data.message);
        // $.post("/account/login", { username, password }, function (data) {
        //   if (data.status === "success") {
        //     window.location.href = data.referer;
        //   } else {
        //     alert(
        //       "Login unsuccessful! Username may not exists, or wrong password"
        //     );
        //   }
        // });
      }
    });
  }
}


$("#regiser-form").on("reset", function () {
  // Xóa các thông báo lỗi khi form được reset
  $(".alert").alert("close");
});
$("#RegisterModal").on("hidden.bs.modal", function () {
  // Xóa các thông báo lỗi khi modal được ẩn đi
  $(".alert").alert("close");
});

$("#RegisterModal").on("show.bs.modal", function () {
  // Xóa các thông báo lỗi khi modal được hiển thị
  $(".alert").alert("close");
});

// Xử lý sự kiện submit của form
$("#regiser-form").submit(function (event) {
  event.preventDefault();
  if ($("#regiser-form")[0].checkValidity() === false) {
    // Nếu form không hợp lệ, ngăn chặn việc submit và hiển thị thông báo lỗi
    event.stopPropagation();
  }
  // Đánh dấu các input đã được kiểm tra validation
  $("#register-form").addClass("was-validated");
  
});