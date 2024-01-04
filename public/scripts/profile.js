function profile() {
  window.location.href = "/profile";
}

$(document).ready(function() {
  $("#confirmBtn").on("click", function() {
      const name = $(".name-input").val();
      if (name === "") {
          const alertHtml = `
              <div class="alert alert-danger alert-dismissible fade show" role="alert" id="loginAlertTag">
                Please fill out the form
              </div>`;
          $(".alert").remove();
          $(".modal-body").prepend(alertHtml);
      } else {
        window.location.href = "/profile?name=" + encodeURIComponent(name);
      }
  });

  //event handling
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
