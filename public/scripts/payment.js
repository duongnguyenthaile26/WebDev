$(document).ready(function () {
  const currentBalance = 123456; // số tiền hiện có trong ví
  const checkoutTotal = Number($(".total-cart-price").text()); // số tiền phải trả
  const odometerBalance = $("#odometer-balance");
  const odometerCheckout = $("#odometer-checkout");

  setInterval(function () {
    odometerBalance.text(currentBalance);
    odometerCheckout.text(checkoutTotal);
  }, 1500);

  function processCheckOutInput() {
    const payName = $(".pay-name-input").val();
    const payAddress = $(".pay-address-input").val();
    const payEmail = $(".pay-email-input").val();
    const payPhoneNum = $(".pay-phonenum-input").val();
    if (
      payName !== "" &&
      payAddress !== "" &&
      payEmail !== "" &&
      payPhoneNum !== ""
    ) {
      // gửi một POST request về server (clear giỏ hàng)
      // hiện thông báo thanh toán thành công
      // chuyển về trang /checkout/cart sau 3s
    } else {
      let alert = "Please fill out the fields";
      if (currentBalance < checkoutTotal) {
        alert =
          "Your wallet does not have enough balance to place order. Please add more credit to the wallet";
      }

      const alertHtml = `
      <div class="alert alert-danger alert-dismissible fade show" role="alert" id="loginAlertTag">
        ${alert}
      </div>`;
      $(".alert").remove();
      $(".modal-body").prepend(alertHtml);
    }
  }

  function processAddFunds() {
    const cardName = $(".name-on-card-input").val();
    const cardNumber = $(".card-number-input").val();
    const month = $(".month-input").val();
    const year = $(".year-input").val();
    const cvv = $(".cvv-input").val();
    if (
      cardName !== "" &&
      cardNumber !== "" &&
      month !== "" &&
      year !== "" &&
      cvv != ""
    ) {
      // gửi một POST request về server (clear giỏ hàng)
      // hiện thông báo thanh toán thành công
      // chuyển về trang /checkout/cart sau 3s
    } else {
      const alertHtml = `
      <div class="alert alert-danger alert-dismissible fade show" role="alert" id="loginAlertTag">
        Please fill out the fields
      </div>`;
      $(".alert").remove();
      $(".modal-body").prepend(alertHtml);
    }
  }

  $(".pay-name-input").keypress(function (event) {
    if (event.which === 13) {
      event.preventDefault();
      processCheckOutInput();
    }
  });

  $(".pay-address-input").keypress(function (event) {
    if (event.which === 13) {
      event.preventDefault();
      processCheckOutInput();
    }
  });

  $(".pay-email-input").keypress(function (event) {
    if (event.which === 13) {
      event.preventDefault();
      processCheckOutInput();
    }
  });

  $(".pay-phonenum-input").keypress(function (event) {
    if (event.which === 13) {
      event.preventDefault();
      processCheckOutInput();
    }
  });

  $("#confirmOrderBtn").on("click", function () {
    processCheckOutInput();
  });

  // Add funds
  $(".name-on-card-input").keypress(function (event) {
    if (event.which === 13) {
      event.preventDefault();
      processAddFunds();
    }
  });

  $(".card-number-input").keypress(function (event) {
    if (event.which === 13) {
      event.preventDefault();
      processAddFunds();
    }
  });

  $(".month-input").keypress(function (event) {
    if (event.which === 13) {
      event.preventDefault();
      processAddFunds();
    }
  });

  $(".year-input").keypress(function (event) {
    if (event.which === 13) {
      event.preventDefault();
      processAddFunds();
    }
  });

  $(".cvv-input").keypress(function (event) {
    if (event.which === 13) {
      event.preventDefault();
      processAddFunds();
    }
  });

  $("#confirmFundBtn").on("click", function () {
    processAddFunds();
  });
});

$("#payment-form").on("reset", function () {
  // Xóa các thông báo lỗi khi form được reset
  $(".alert").remove();
});

$("#PayModal").on("hidden.bs.modal", function () {
  // Xóa các thông báo lỗi khi modal được ẩn đi
  $(".alert").remove();
});

$("#PayModal").on("show.bs.modal", function () {
  // Xóa các thông báo lỗi khi modal được hiển thị
  $(".alert").remove();
});
