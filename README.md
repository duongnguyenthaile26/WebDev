## Cái hiển thị lượt truy cập vào trang web phải là **biểu đồ** nha, theo yêu cầu trong cái bảng yêu cầu (giống như cái thống kê ở trên Moodle ấy)

## Bây giờ làm hoàn thiện trang tìm kiếm với trang chi tiết sản phẩm nữa (Nhớ là thêm vào các tag a cho các card sản phẩm để có thể click vào card của cờ rồi đến trang thông tin chi tiết)
## --> Xong trang tìm kiếm (filter theo category cũng ở trang này), có gì xem qua với kiểm lỗi giúp nha/ cũng sài fetch để pagination mượt hơn chút không load lại trang (này chắc tính là sài AJAX kh?) 

Với lại nếu muốn đồng bộ code thì để tab size = 2, với lại dùng cái formatter Prettier trên VSCODE nha (cho canh hàng code đẹp, nhớ để format on save), nếu có sử dụng thì copy nội dung file settings.json đã có đăng lên repo và copy vào settings.json trên VSCODE của laptop của mình

**Lưu ý:** nếu có chỉnh sửa các tag trong các file HTML/EJS thì cẩn thận khi chỉnh các class nha, vì có thể class đó được dùng cho mục đích viết JQuery

- **Update 1:** đã thêm thư mục các cờ (flags) vào trong public, và đã thêm thông tin các cờ vào database MongoDB

- **Update 2:** đã thêm https (lúc vào trang web nhớ chỉnh lại từ http thành https, và trình duyệt sẽ báo là không an toàn, vì mình chỉ xài self-sign certificates)
