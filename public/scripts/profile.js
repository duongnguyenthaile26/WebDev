// -------------------------Handle Name-------------------------
$(document).ready(function () {
  function processNameInput() {
    const name = $(".name-input").val();
    if (name === "") {
      const alertHtml = `
      <div class="alert alert-danger alert-dismissible fade show" role="alert" id="loginAlertTag">
        Please enter your new name
      </div>`;
      $(".alert").remove();
      $(".modal-body").prepend(alertHtml);
    } else {
      // gửi một POST request về cho server
      // hiện thông báo là đã đổi tên thành công
    }
  }

  $(".name-input").keypress(function (event) {
    if (event.which === 13) {
      event.preventDefault();
      processNameInput();
    }
  });

  $("#confirmNameBtn").on("click", function () {
    processNameInput();
  });
});

$("#name-input-form").on("reset", function () {
  // Xóa các thông báo lỗi khi form được reset
  $(".alert").remove();
});

$("#NameModal").on("hidden.bs.modal", function () {
  // Xóa các thông báo lỗi khi modal được ẩn đi
  $(".alert").remove();
});

$("#NameModal").on("show.bs.modal", function () {
  // Xóa các thông báo lỗi khi modal được hiển thị
  $(".alert").remove();
});

// -------------------------Handle Password-------------------------
$(document).ready(function () {
  function processPassInput() {
    const currentPassword = $(".current-pass-input").val();
    const newPassword = $(".new-pass-input").val();
    const confirmNewPassword = $(".confirm-new-pass-input").val();
    if (
      currentPassword !== "" &&
      newPassword !== "" &&
      confirmNewPassword !== ""
    ) {
      // Xử lý trường hợp hai password mới không khớp nhau
      // Gửi một POST request về cho server
      // hiện thông báo đổi pass thành công
    } else {
      const alertHtml = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert" id="loginAlertTag">
          Please fill out the fields
        </div>`;
      $(".alert").remove();
      $(".modal-body").prepend(alertHtml);
    }
  }

  $(".old-pass-input").keypress(function (event) {
    if (event.which === 13) {
      event.preventDefault();
      processPassInput();
    }
  });

  $(".new-pass-input").keypress(function (event) {
    if (event.which === 13) {
      event.preventDefault();
      processPassInput();
    }
  });

  $(".confirm-new-pass-input").keypress(function (event) {
    if (event.which === 13) {
      event.preventDefault();
      processPassInput();
    }
  });

  $("#confirmPassBtn").on("click", function () {
    processPassInput();
  });
});

$(".toggle-password").on("click", function () {
  const passwordField = $(this).closest(".input-group").find("input");
  const icon = $(this).find("i");

  if (passwordField.attr("type") === "password") {
    passwordField.attr("type", "text");
    icon.removeClass("far fa-eye").addClass("far fa-eye-slash");
  } else {
    passwordField.attr("type", "password");
    icon.removeClass("far fa-eye-slash").addClass("far fa-eye");
  }
});

$("#pass-input-form").on("reset", function () {
  // Xóa các thông báo lỗi khi form được reset
  $(".alert").remove();
});

$("#PassModal").on("hidden.bs.modal", function () {
  // Xóa các thông báo lỗi khi modal được ẩn đi
  $(".alert").remove();
});

$("#PassModal").on("show.bs.modal", function () {
  // Xóa các thông báo lỗi khi modal được hiển thị
  $(".alert").remove();
});
