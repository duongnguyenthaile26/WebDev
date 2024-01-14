function showAlert(status, message) {
  const alertHtml = `
  <div class="alert alert-${status} alert-dismissible fade show" role="alert">
    ${message}
  </div>`;
  $(".alert").remove();
  $(".modal-body").prepend(alertHtml);
}

$(document).ready(function () {
  function processNameInput() {
    const name = $(".name-input").val().trim();
    if (name === "") {
      showAlert("danger", "Please enter your new name");
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
          data.status === "success"
            ? showAlert("success", data.message)
            : showAlert("danger", data.message);
          if (data.status === "success") {
            setTimeout(() => (window.location.href = "/account/profile"), 2000);
          }
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

$(document).ready(function () {
  function processPassInput() {
    // Minimum eight characters, at least one uppercase letter, one lowercase letter and one number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}/;

    const currentPassword = $(".current-pass-input").val();
    const newPassword = $(".new-pass-input").val();
    const confirmNewPassword = $(".confirm-new-pass-input").val();
    if (
      currentPassword !== "" &&
      newPassword !== "" &&
      confirmNewPassword !== ""
    ) {
      if (newPassword !== confirmNewPassword) {
        showAlert(
          "danger",
          "New password and confirm new password do not match"
        );
        return;
      }
      if (!passwordRegex.test(newPassword)) {
        showAlert(
          "danger",
          "Password must have at least eight characters, at least one uppercase letter, one lowercase letter and one number"
        );
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
          data.status === "success"
            ? showAlert("success", data.message)
            : showAlert("danger", data.message);
          if (data.status === "success") {
            setTimeout(() => (window.location.href = "/account/profile"), 2000);
          }
        },
      });
    } else {
      showAlert("danger", "Please fill out the fields");
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
