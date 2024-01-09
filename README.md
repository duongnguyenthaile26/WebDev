# Đã xong CRUD cho category và user, giờ còn CRUD sản phẩm thì mình còn cần màn hình edit flag với add flag, làm cho t hai cái đó nữa là oke

# T đã có upload file CacViewConLai.png, là mấy cái view cuối cùng mình cần phải làm, ae front-end vào xem rồi làm giúp t nha, có gì cứ hỏi t

# Còn bên server thanh toán thì Thái lo tiếp nha, nếu cần thì cứ nói t giúp

### Minor note: t có mới sử dụng extension format mới là EJS Beautify để format các file EJS, ae có thể sử dụng setting của t trong file settings.json

**Lưu ý 1:** nếu có chỉnh sửa các tag trong các file HTML/EJS thì cẩn thận khi chỉnh các class nha, vì có thể class đó được dùng cho mục đích viết JQuery

**Lưu ý 2:** nếu có comment trong các file EJS thì đừng dùng comment // bên trong tag EJS nha, mà ra bên ngoài tag EJS rồi dùng cái comment của html <!--

- **Update 1:** đã thêm thư mục các cờ (flags) vào trong public, và đã thêm thông tin các cờ vào database MongoDB

- **Update 2:** đã thêm https (lúc vào trang web nhớ chỉnh lại từ http thành https, và trình duyệt sẽ báo là không an toàn, vì mình chỉ xài self-sign certificates)

- **Update 3:** đã thêm chức năng đăng ký, đăng nhập, đăng xuất, có hai tài khoản có sẵn trong database là user1 - 123 và admin1 - 123

- **Update 4:** đã thêm chức năng đăng nhập bằng Google

- **Update 5:** đã thêm hiển thị biểu đồ số lượt ghé thăm trang
