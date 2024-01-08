// -------------------------Handle Name-------------------------
$(document).ready(function () {
  function processNameInput() {
    const name = $(".name-input").val();
    if (name === "") {
      const alertHtml = `
      <div class="alert alert-danger alert-dismissible fade show" role="alert">
        Please enter your new name
      </div>`;
      $(".alert").remove();
      $(".modal-body").prepend(alertHtml);
    } else {
      $.ajax({
        url: "/account/modify",
        type: "PATCH",
        contentType: "application/json",
        data: JSON.stringify({
          mode: "name",
          name,
        }),
        success: function (data) {
          const alertHtml = `
          <div class="alert alert-${
            data.status === "fail" ? "danger" : "success"
          } alert-dismissible fade show" role="alert">
            ${data.message}
          </div>`;
          $(".alert").remove();
          $(".modal-body").prepend(alertHtml);
          setTimeout(() => (window.location.href = "/account/profile"), 2000);
        },
      });
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
      if (newPassword !== confirmNewPassword) {
        const alertHtml = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
          New password and confirm new password do not match
        </div>`;
        $(".alert").remove();
        $(".modal-body").prepend(alertHtml);
        return;
      }
      $.ajax({
        url: "/account/modify",
        type: "PATCH",
        contentType: "application/json",
        data: JSON.stringify({
          mode: "password",
          currentPassword,
          newPassword,
        }),
        success: function (data) {
          const alertHtml = `
          <div class="alert alert-${
            data.status === "fail" ? "danger" : "success"
          } alert-dismissible fade show" role="alert">
            ${data.message}
          </div>`;
          $(".alert").remove();
          $(".modal-body").prepend(alertHtml);
          if (data.status === "success") {
            setTimeout(() => (window.location.href = "/account/profile"), 2000);
          }
        },
      });
    } else {
      const alertHtml = `
      <div class="alert alert-danger alert-dismissible fade show" role="alert">
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
