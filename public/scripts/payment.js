$(document).ready(async function () {
  const odometerBalance = $("#odometer-balance");
  const odometerCheckout = $("#odometer-checkout");
  const checkoutTotal = Number($(".total-cart-price").text()); // số tiền phải trả
  let currentBalance = await new Promise((resolve, reject) => {
    $.get("/checkout/balance", function (data) {
      // Nếu status === fail => data.balance = -1
      resolve(data.balance);
    });
  }); // số tiền hiện có trong ví
  setInterval(function () {
    odometerBalance.text(currentBalance);
    odometerCheckout.text(checkoutTotal);
  }, 1500);

  function handlePopup(component, buttonFunction) {
    $(".popup").prepend(component);
    $(".popup").fadeIn(500);
    $("#overlay").fadeIn(500);
    $("body > *:not(.popup, #overlay)").addClass("blurred");
    $("#okButton").on("click", function () {
      $(".popup").fadeOut();
      $("#overlay").fadeOut();
      $(".popup").empty();
      $("body > *:not(.popup, #overlay)").removeClass("blurred");
      if (typeof buttonFunction === "function") {
        buttonFunction();
      }
    });
  }

  function processCheckOutInput() {
    const payName = $(".pay-name-input").val().trim();
    const payAddress = $(".pay-address-input").val().trim();
    const payEmail = $(".pay-email-input").val().trim();
    const payPhoneNum = $(".pay-phonenum-input").val().trim();
    if (
      payName !== "" &&
      payAddress !== "" &&
      payEmail !== "" &&
      payPhoneNum !== "" &&
      payPhoneNum.length >= 10 // &&
      // currentBalance >= checkoutTotal
    ) {
      // gửi một POST request về server (clear giỏ hàng)
      // hiện thông báo thanh toán thành công
      $(".alert").remove();
      $("#loader-container, #overlay").fadeIn();
      $("body > *:not(#loader-container, #overlay)").addClass("blurred");

      setTimeout(function () {
        $("#loader-container, #overlay").fadeOut();
        $("body > *:not(#loader-container, #overlay)").removeClass("blurred");
        console.log(checkoutTotal);
        $.post(
          "/checkout/payment",
          {
            amount: checkoutTotal,
            name: payName,
            address: payAddress,
            email: payEmail,
            phone: payPhoneNum,
          },
          function (data) {
            if (data.status === "success") {
              handlePopup(`
                <img src="/images/404-tick.png" alt="tick">
                <h2>SUCCESSFUL</h2>
                <button type="button" class="btn btn-outline-success mt-4 w-100" id="okButton">OK</button>
              `, function() {
                window.location.href = "/checkout/cart";
              });
            } else {
              // xử lí fail
              handlePopup(`
                <img src="/images/404-cross.png" alt="tick">
                <h2>FAIL</h2>
                <p>${data.message}</p>
                <button type="button" class="btn btn-outline-danger mt-4 w-100" id="okButton">OK</button>
              `);
            }
          }
        );
      }, 3000);
    } else {
      let alert;
      const mailRegex =
        /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
      if (
        payName === "" ||
        payAddress === "" ||
        payEmail === "" ||
        payPhoneNum === ""
      ) {
        alert = "Please fill out the fields";
      }
      // Check phone number
      else if (payPhoneNum.length < 10) {
        alert = "Invalid phone number";
      }
      // Check balance
      else if (currentBalance < checkoutTotal) {
        alert =
          "Your wallet does not have enough balance to place order. Please add more credit to the wallet";
      } else if (!mailRegex.test(payEmail)) {
        alert = "Invalid mail format";
      } else {
        alert("Error");
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
    const cardNumber = $(".card-number-input").val().replace(/\s/g, "");
    const expiry = $(".expiry-input").val();
    const cvv = $(".cvv-input").val();
    const method = $(
      '.payment-method input[name="payment-method"]:checked'
    ).val();
    const visa = $("#method-1").prop("checked");
    const master = $("#method-2").prop("checked");
    console.log(visa);
    console.log(master);
    if (
      paymentAmount !== "" &&
      parseFloat(paymentAmount) >= 10 &&
      cardName !== "" &&
      cardNumber !== "" &&
      cardNumber.length === 16 &&
      expiry !== "" &&
      expiry.length === 5 &&
      cvv !== "" &&
      cvv.length >= 3 &&
      (visa || master)
    ) {
      // Hiển thị loading và chặn tương tác
      $(".alert").remove();
      $("#loader-container, #overlay").fadeIn();
      $("body > *:not(#loader-container, #overlay)").addClass("blurred");

      setTimeout(function () {
        $("#loader-container, #overlay").fadeOut();
        $("body > *:not(#loader-container, #overlay)").removeClass("blurred");

        // Xử lý khi thành công
        $.post(
          "/checkout/deposit",
          {
            amount: paymentAmount,
            bankCard: {
              method: visa ? "visa" : "mastercard",
              id: cardNumber,
              holder: cardName,
              issueDate: expiry,
              cvv: cvv,
            },
          },
          function (data) {
            console.log(data);
            if (data.status === "success") {
              currentBalance = data.balance;
              handlePopup(`
                <img src="/images/404-tick.png" alt="tick">
                <h2>SUCCESSFUL</h2>
                <button type="button" class="btn btn-outline-success mt-4 w-100" id="okButton">OK</button>
              `);
              $("#AddMoneyModal").modal("hide"); // Đóng modal cũ
              $("#AddMoneyModal input").val(""); // clear bank information
              $("#PayModal").modal("show"); // Mở modal mới
              $("input[name='payment-method']").prop("checked", false);
            } else {
              // data.staus === "fail"
              handlePopup(`
                <img src="/images/404-cross.png" alt="tick">
                <h2>FAIL</h2>
                <p>${data.message}</p>
                <button type="button" class="btn btn-outline-danger mt-4 w-100" id="okButton">OK</button>
              `);
            }
          }
        );
      }, 3000);
    } else {
      let alert;
      let currentDate = new Date();

      if (
        paymentAmount === "" ||
        cardName === "" ||
        cardNumber === "" ||
        expiry === "" ||
        cvv === ""
      ) {
        alert = "Please fill out the fields";
      }
      // Check payment amount
      else if (paymentAmount < 10) {
        alert = "You must pay at least $10";
      }
      // Check card number
      else if (cardNumber.length < 16) {
        alert = "Invalid card number";
      }
      // Check expiry date
      else if (parseInt(expiry.substring(0, 2)) < currentDate.getMonth() + 1) {
        alert = "Your card has expired";
      } else if (expiry.length < 5) {
        alert = "Invalid expiry date";
      }
      // Check cvv number
      else if (cvv.length < 3) {
        alert = "Invalid cvv number";
      } else if (!method) {
        alert = "Please choose a payment method";
      }

      const alertHtml = `
      <div class="alert alert-danger alert-dismissible fade show" role="alert" id="loginAlertTag">
        ${alert}
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

  $("#phone").on("input", function () {
    var phoneNumber = $(this).val().replace(/\D/g, "");

    $(this).val(phoneNumber);
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

  $("#card-number").on("keydown", function (event) {
    if (event.which === 37 || event.which === 39) {
      event.preventDefault();
    }
  });

  $("#card-number").on("input", function () {
    var cardNumber = $(this).val().replace(/\D/g, "");

    $(this).val(cardNumber.replace(/(\d{4})/g, "$1 ").trim());
  });

  $(".expiry-input").keypress(function (event) {
    if (event.which === 13) {
      event.preventDefault();
      processAddFunds();
    }
  });

  $("#expiry").on("keydown", function (event) {
    var inputValue = $(this)
      .val()
      .replace(/[^0-9/]/g, "");

    if (
      (inputValue.includes("/") || inputValue.length < 1) &&
      event.key === "/"
    ) {
      event.preventDefault();
    }

    if (event.which === 8 && inputValue.charAt(inputValue.length - 1) === "/") {
      inputValue = inputValue.slice(0, -2);
      $(this).val(inputValue);
      event.preventDefault();
    }

    if (event.which === 37 || event.which === 39) {
      event.preventDefault();
    }
  });

  $("#expiry").on("input", function (event) {
    var inputExpiry = $(this)
      .val()
      .replace(/[^0-9/]/g, "");

    // Tự động thêm 0 vào trước tháng
    if (inputExpiry.length === 2 && inputExpiry.charAt(1) === "/") {
      if (inputExpiry.charAt(0) !== "0") {
        inputExpiry = "0" + inputExpiry;
      } else {
        inputExpiry = "01";
      }
    }

    // Tự động chỉnh logic của tháng
    if (inputExpiry.length === 2) {
      if (parseInt(inputExpiry) > 12) {
        inputExpiry = "12";
      }
      if (parseInt(inputExpiry) < 1) {
        inputExpiry = "01";
      }
    }

    // Thêm ký tự "/" sau tháng
    if (inputExpiry.length >= 2 && inputExpiry.charAt(2) !== "/") {
      inputExpiry =
        inputExpiry.substring(0, 2) + "/" + inputExpiry.substring(2);
    }

    // Cài đặt năm tối thiểu là 2024
    if (inputExpiry.length >= 5) {
      var year = inputExpiry.substring(3, 5);
      if (parseInt(year) < 24) {
        year = "24";
      }
      inputExpiry = inputExpiry.substring(0, 3) + year;
    }

    // Không cho phép nhập ký tự "/" nếu đã tồn tại
    if (inputExpiry.length > 2 && event.key === "/" && event.keyCode === 191) {
      event.preventDefault();
    }

    $(this).val(inputExpiry);
  });

  $(".cvv-input").keypress(function (event) {
    if (event.which === 13) {
      event.preventDefault();
      processAddFunds();
    }
  });

  $("#cvv").on("input", function () {
    var inputCvv = $(this)
      .val()
      .replace(/[^0-9]/g, "");

    $(this).val(inputCvv);
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
