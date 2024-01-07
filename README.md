# Đã thêm xác thực sử dụng email khi đăng ký, anh em vào test thử nha (t xóa hết tài khoản cũ rồi, chỉ còn user1 - 123 với admin1 - 123)

## Tín chỉnh lại cái màn hình lúc nạp tiền vào ví, cái ô nhập Expiry date, cho nó thành hai ô nhập tháng và năm riêng, nằm ngang hàng với nhau nha, giữa hai ô có dấu "/". Còn lại thì ổn rồi.

### Minor note: t có mới sử dụng extension format mới là EJS Beautify để format các file EJS, ae có thể sử dụng setting của t trong file settings.json

**Lưu ý 1:** nếu có chỉnh sửa các tag trong các file HTML/EJS thì cẩn thận khi chỉnh các class nha, vì có thể class đó được dùng cho mục đích viết JQuery

**Lưu ý 2:** nếu có comment trong các file EJS thì đừng dùng comment // bên trong tag EJS nha, mà ra bên ngoài tag EJS rồi dùng cái comment của html <!--

- **Update 1:** đã thêm thư mục các cờ (flags) vào trong public, và đã thêm thông tin các cờ vào database MongoDB

- **Update 2:** đã thêm https (lúc vào trang web nhớ chỉnh lại từ http thành https, và trình duyệt sẽ báo là không an toàn, vì mình chỉ xài self-sign certificates)

- **Update 3:** đã thêm chức năng đăng ký, đăng nhập, đăng xuất, có hai tài khoản có sẵn trong database là user1 - 123 và admin1 - 123

- **Update 4:** đã thêm chức năng đăng nhập bằng Google

- **Update 5:** đã thêm hiển thị biểu đồ số lượt ghé thăm trang
