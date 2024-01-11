$(document).ready(async function () {
  const odometerBalance = $("#odometer-balance");
  const odometerCheckout = $("#odometer-checkout");
  const checkoutTotal = Number($(".total-cart-price").text()); // số tiền phải trả
  const currentBalance = await new Promise((resolve, reject) => {
    $.get("/checkout/balance", function (data) {
      // Nếu status === fail => data.balance = -1
      resolve(data.balance);
    });
  }); // số tiền hiện có trong ví
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
    const paymentAmount = $(".payment-amount-input").val();
    const cardName = $(".name-on-card-input").val();
    const cardNumber = $(".card-number-input").val();
    const expiry = $(".expiry-input").val();
    const cvv = $(".cvv-input").val();
    if (
      paymentAmount !== "" &&
      cardName !== "" &&
      cardNumber !== "" &&
      expiry !== "" &&
      cvv != ""
    ) {
      // Show loader
      $("#loader-container").fadeIn();
      $("body > *:not(#loader-container)").addClass("blurred");

      setTimeout(function () {
        $("#loader-container").fadeOut();
        $("body > *:not(#loader-container)").removeClass("blurred");

        // Display success message or perform other actions
        //alert("Payment successful!");
        currentBalance += Number(paymentAmount);
      }, 3000);
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
  $(".payment-amount-input").keypress(function (event) {
    if (event.which === 13) {
      event.preventDefault();
      processAddFunds();
    }
  });

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

  $(".expiry-input").keypress(function (event) {
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
