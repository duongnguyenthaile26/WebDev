// -------------------------Handle CheckOut-------------------------
$(document).ready(function() {
    const value = 123456; // số tiền hiện có trong ví
    const total = 123456; // số tiền phải trả
    const odometer = $('#odometer');

    setInterval(function() {
        //value += 7;
        odometer.text(value);
    }, 2000);

    function processCheckOutInput() {
        const payName = $(".pay-name-input").val();
        const payAddress = $(".pay-address-input").val();
        const payEmail = $(".pay-email-input").val();
        const payPhoneNum = $(".pay-phonenum-input").val();
        if (payName !== "" && payAddress !== "" && payEmail !== "" && payPhoneNum !== "") {
            //window.location.href = "/profile?name=" + encodeURIComponent(name);
        } else {
            let alert = "Please fill out the form";
            if (value < total) {
                alert = "You don't have enough money for payment";
            }
            
            const alertHtml = `
              <div class="alert alert-danger alert-dismissible fade show" role="alert" id="loginAlertTag">
                ${alert}
              </div>`;
            $(".alert").remove();
            $(".modal-body").prepend(alertHtml);
        }
    }

    $(".pay-name-input").keypress(function(event) {
        if (event.which === 13) {
          event.preventDefault();
          processCheckOutInput();
        }
    });
    
    $(".pay-address-input").keypress(function(event) {
        if (event.which === 13) {
          event.preventDefault();
          processCheckOutInput();
        }
    });
    
    $(".pay-email-input").keypress(function(event) {
        if (event.which === 13) {
          event.preventDefault();
          processCheckOutInput();
        }
    });

    $(".pay-phonenum-input").keypress(function(event) {
        if (event.which === 13) {
          event.preventDefault();
          processCheckOutInput();
        }
    });
    
    $("#confirmOrderBtn").on("click", function() {
        processCheckOutInput();
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

// -------------------------Handle AddMoney-------------------------
