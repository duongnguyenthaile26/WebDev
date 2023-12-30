## Trước năm mới, làm thêm trang giỏ hàng với trang profile là oke, back-end thì làm thêm cái hệ thống phụ để chuẩn bị ráp với hệ thống chính

## Trước khi thi cuối kỳ môn SE, làm xong giao diện home của admin là oke (vì cái này nó có khá nhiều thứ liên quan cần làm)

## Để tui làm trang profile nhe guys!!! (by Tín) (Nếu làm trang profile thì chỉ cần là hiện name, username, và cho cái nút để đi đến trang giỏ hàng nha, với cho nút để đi đến màn hình đổi mật khẩu nữa, and có thể cho thêm chức năng đổi tên)

Với lại nếu muốn đồng bộ code thì để tab size = 2, với lại dùng cái formatter Prettier trên VSCODE nha (cho canh hàng code đẹp, nhớ để format on save), nếu có sử dụng thì copy nội dung file settings.json đã có đăng lên repo và copy vào settings.json trên VSCODE của laptop của mình

**Lưu ý 1:** nếu có chỉnh sửa các tag trong các file HTML/EJS thì cẩn thận khi chỉnh các class nha, vì có thể class đó được dùng cho mục đích viết JQuery

**Lưu ý 2:** nếu có comment trong các file EJS thì đừng dùng comment // bên trong tag EJS nha, mà ra bên ngoài tag EJS rồi dùng cái comment của html <!--

- **Update 1:** đã thêm thư mục các cờ (flags) vào trong public, và đã thêm thông tin các cờ vào database MongoDB

- **Update 2:** đã thêm https (lúc vào trang web nhớ chỉnh lại từ http thành https, và trình duyệt sẽ báo là không an toàn, vì mình chỉ xài self-sign certificates)

- **Update 3:** đã thêm chức năng đăng ký, đăng nhập, đăng xuất, có một tài khoản có sẵn trong database là user1 - 123456

- **Update 4:** đã thêm chức năng đăng nhập bằng Google, anh em vào test thử đi

- **Update 5:** đã thêm hiển thị biểu đồ số lượt ghé thăm trang
