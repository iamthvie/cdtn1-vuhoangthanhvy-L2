# Bug Log - Mekong Mobile CRM (Flow L2)

## BUG-01: Cột số điện thoại trên giao diện bị hiển thị nhầm thành tên khách hàng
1. Mã và mức độ: BUG-01 - CRITICAL (Sai lệch dữ liệu người dùng và vi phạm quy tắc che số QT-15)
2. Phát hiện bởi: TC-11 (Test Report) / Kiểm tra giao diện thực tế
3. Triệu chứng: Bảng danh sách phiếu bảo hành ở giao diện web hiển thị toàn tên khách hàng (ví dụ "Phan Hữu Bình") ngay tại cột Số điện thoại.
4. Cách tái lập: Mở trang danh sách phiếu (`index.html`), quan sát cột số điện thoại của bảng dữ liệu.
5. Nguyên nhân: Câu lệnh SQL tại `ticket.repository.js` đặt biệt danh cột `c.full_name AS customer_phone`, khiến contract `ticket.contract.js` bốc nhầm tên khách hàng gán vào biến số điện thoại.
6. Cách sửa: Sửa lại câu lệnh truy vấn trong `ticket.repository.js` thành `c.full_name AS customer_name` và lấy đúng cột `c.phone`, đồng thời chuẩn hóa lại hàm map contract.
7. Commit và xác nhận: https://github.com/iamthvie/cdtn1-vuhoangthanhvy-L2/commit/022534bcfbc83b6acc786b3018a427da5ead3c02 (Chạy lại TC-11 -> Trả về chuẩn dạng `076****885`, PASS).

---

## BUG-02: Tạo phiếu thất bại khi phần mô tả lỗi quá ngắn (dưới 10 ký tự)
1. Mã và mức độ: BUG-02 - MAJOR (Lỗi validation dữ liệu đầu vào tại tầng Service/API)
2. Phát hiện bởi: TC-06 (Test Report - Giá trị biên)
3. Triệu chứng: Gửi request tạo phiếu với mô tả lỗi ngắn hơn 10 ký tự nhưng API trả về lỗi 500 thay vì 400 Bad Request kèm thông báo rõ ràng.
4. Cách tái lập: Gửi POST request tới `/api/tickets` với trường `issueDesc: "Lỗi pin"` (8 ký tự).
5. Nguyên nhân: Tầng xử lý backend thiếu đoạn điều kiện kiểm tra độ dài tối thiểu (` .length >= 10 `) trước khi thực hiện câu lệnh INSERT vào CSDL.
6. Cách sửa: Bổ sung logic kiểm tra validate độ dài mô tả lỗi tại `ticket.service.js`, trả về mã `400 Bad Request` nếu không đạt điều kiện.
7. Commit và xác nhận: https://github.com/iamthvie/cdtn1-vuhoangthanhvy-L2/commit/022534bcfbc83b6acc786b3018a427da5ead3c02 (Chạy lại TC-06 -> Trả về mã 400 kèm thông điệp rõ ràng, PASS).

---

## BUG-03: Lỗi phân quyền cho phép nhân viên thao tác chéo giữa các trung tâm (QT-14)
1. Mã và mức độ: BUG-03 - CRITICAL (Lỗ hổng bảo mật kiểm soát truy cập - OWASP A01 Broken Access Control)
2. Phát hiện bởi: TC-10 (Test Report - Bảo mật)
3. Triệu chứng: Nhân viên thuộc một trung tâm bảo hành có thể gọi API cập nhật phiếu thuộc sở hữu của trung tâm khác mà không bị chặn.
4. Cách tái lập: Dùng token của nhân viên trung tâm A gửi request PUT/DELETE tới một `ticket_id` thuộc trung tâm B.
5. Nguyên nhân: Tầng Controller/Middleware chưa kiểm tra điều kiện so khớp `service_center_id` của tài khoản đang đăng nhập với thông tin phiếu trong CSDL.
6. Cách sửa: Thêm middleware kiểm tra quyền sở hữu trung tâm (`checkCenterPermission`) trước khi cho phép thực hiện các thao tác chỉnh sửa/xóa phiếu.
7. Commit và xác nhận: https://github.com/iamthvie/cdtn1-vuhoangthanhvy-L2/commit/022534bcfbc83b6acc786b3018a427da5ead3c02 (Chạy lại TC-10 -> Trả về mã 403 Forbidden, PASS).