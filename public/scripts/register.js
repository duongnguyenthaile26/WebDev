function showAlert(status, message) {
  const alertHtml = `
  <div class="alert alert-${status} alert-dismissible fade show" role="alert">
    ${message}
  </div>`;
  $(".alert").remove();
  $(".modal-body").prepend(alertHtml);
}

function register() {
  // Minimum eight characters, at least one uppercase letter, one lowercase letter and one number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,32}$/;

  // RFC 5322
  const mailRegex =
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

  // At least 4 characters, at most 16 characters, only alphanumericals, dots, and underscores
  const usernameRegex = /^[a-zA-Z0-9._]{4,16}$/;

  const username = $(".username-input-reg").val();
  const name = $(".name-input-reg").val().trim();
  const mail = $(".mail-input-reg").val();
  const password = $(".password-input-reg").val();
  const confirmPassword = $(".passwordConfirm-input-reg").val();
  if (
    username === "" ||
    name === "" ||
    password === "" ||
    confirmPassword === "" ||
    mail === ""
  ) {
    showAlert("danger", "Please fill out the fields");
    return;
  }
  if (password !== confirmPassword) {
    showAlert("danger", "Password and confirm password do not match");
    return;
  }
  if (!usernameRegex.test(username)) {
    showAlert(
      "danger",
      "Username must have at least 4 characters, at most 16 characters, and only containing alphanumericals, dots ('.'), and underscores ('_')"
    );
    return;
  }
  if (!passwordRegex.test(password)) {
    showAlert(
      "danger",
      "Password must have at least eight characters, at most 32 characters, at least one uppercase letter, one lowercase letter and one number"
    );
    return;
  }
  if (!mailRegex.test(mail)) {
    showAlert("danger", "Invalid mail format");
    return;
  }
  if (name.length > 16) {
    showAlert("danger", "Name must be less than 17 characters");
    return;
  }
  showAlert("success", "Please wait...");
  $.post(
    "/account/register",
    { username, name, password, mail },
    function (data) {
      data.status === "success"
        ? showAlert("success", data.message)
        : showAlert("danger", data.message);
    }
  );
}

function handleKeyPress(event) {
  if (event.keyCode === 13) {
    login();
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
