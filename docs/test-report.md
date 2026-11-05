# Test Report - Mekong Mobile Smart CRM (Luồng L2)

## Summary
- **Total Test Cases Executed**: 10
- **Passed**: 10
- **Failed**: 0
- **Coverage**: Happy Path, Boundary, Invalid Data, Security & Filtering, Idempotency & CSV Migration.

---

## Detailed Test Cases

### 1. TC-01 (Luồng đúng - Happy Path) | Ưu tiên: Cao
- **Tiền điều kiện**: Database đã seed dữ liệu mẫu, thiết bị `SN817005543169` tồn tại trong hệ thống.
- **Bước thực hiện**: Thao tác tra cứu thông tin thiết bị trực tiếp trên giao diện web quản lý.
- **Kết quả mong đợi**: Trả về giao diện hiển thị đúng tên khách hàng, mã thiết bị, trạng thái bảo hành và lịch sử sửa chữa.
- **Kết quả thực tế**: Giao diện hiển thị thành công, dữ liệu trả về khớp hoàn toàn với thực tế.
- **Trạng thái**: **PASS**
- **Ảnh chụp**: `docs/screenshots/TC-01.png`

### 2. TC-02 (Luồng đúng - Happy Path) | Ưu tiên: Cao
- **Tiền điều kiện**: Thiết bị tồn tại trong hệ thống, thực hiện thao tác tạo phiếu trên giao diện.
- **Bước thực hiện**: Điền thông tin tiếp nhận phiếu bảo hành mới trên form web và bấm gửi.
- **Kết quả mong đợi**: Hệ thống ghi nhận thành công, sinh mã phiếu mới tự động trên giao diện danh sách.
- **Kết quả thực tế**: Giao diện phản hồi thành công, mã phiếu mới hiển thị chính xác.
- **Trạng thái**: **PASS**
- **Ảnh chụp**: `docs/screenshots/TC-02-1.png` `docs/screenshots/TC-02-2.png`

### 3. TC-03 (Dữ liệu biên - Boundary) | Ưu tiên: Trung bình
- **Tiền điều kiện**: Giao diện trang web đang hoạt động bình thường.
- **Bước thực hiện**: Nhập chuỗi trống hoặc ký tự cực ngắn vào ô tìm kiếm/tra cứu trên giao diện.
- **Kết quả mong đợi**: Giao diện cảnh báo hoặc hiển thị thông báo không tìm thấy, không làm sập trang web.
- **Kết quả thực tế**: Hệ thống xử lý an toàn, hiển thị thông báo trực quan trên màn hình.
- **Trạng thái**: **PASS**
- **Ảnh chụp**: `docs/screenshots/TC-03.png`

### 4. TC-04 (Dữ liệu biên - Boundary) | Ưu tiên: Trung bình
- **Tiền điều kiện**: Mở giao diện tạo phiếu bảo hành mới.
- **Bước thực hiện**: Bỏ trống trường mô tả lỗi hoặc nhập vượt quá giới hạn ký tự cho phép rồi bấm tạo phiếu.
- **Kết quả mong đợi**: Giao diện hiển thị lỗi cảnh báo form không hợp lệ, chặn không cho gửi request xấu.
- **Kết quả thực tế**: Form báo lỗi trực quan tại chỗ, ngăn chặn dữ liệu không hợp lệ.
- **Trạng thái**: **PASS**
- **Ảnh chụp**: `docs/screenshots/TC-04.png`

### 5. TC-05 (Dữ liệu sai - Invalid Data) | Ưu tiên: Cao
- **Tiền điều kiện**: Truy cập tính năng tra cứu trên giao diện web.
- **Bước thực hiện**: Nhập mã serial không có thật (ví dụ: chuỗi số ngẫu nhiên) để tra cứu.
- **Kết quả mong đợi**: Giao diện hiển thị thông báo "Không tìm thấy thiết bị" một cách thân thiện.
- **Kết quả thực tế**: Hiển thị thông báo lỗi rõ ràng trên giao diện, không làm gián đoạn ứng dụng.
- **Trạng thái**: **PASS**
- **Ảnh chụp**: `docs/screenshots/TC-05.png`

### 6. TC-06 (Dữ liệu sai - Invalid Data) | Ưu tiên: Cao
- **Tiền điều kiện**: Mở giao diện tạo phiếu tiếp nhận.
- **Bước thực hiện**: Cố tình bỏ trống các trường bắt buộc trên form và bấm xác nhận gửi.
- **Kết quả mong đợi**: Giao diện hiển thị cảnh báo đỏ yêu cầu điền đủ thông tin bắt buộc.
- **Kết quả thực tế**: Hệ thống chặn lại và báo lỗi trực quan trên các trường thiếu.
- **Trạng thái**: **PASS**
- **Ảnh chụp**: `docs/screenshots/TC-06.png`

### 7. TC-07 (Bảo mật / Chất lượng dữ liệu) | Ưu tiên: Cao
- **Tiền điều kiện**: Đăng nhập tài khoản nhân viên thông thường trên giao diện web.
- **Bước thực hiện**: Truy cập giao diện xem chi tiết thông tin khách hàng và thiết bị.
- **Kết quả mong đợi**: Số điện thoại khách hàng hiển thị trên giao diện phải được che tự động (Data Masking, ví dụ: `076****885`).
- **Kết quả thực tế**: Giao diện hiển thị số điện thoại đã được che ký tự ở giữa theo đúng quy định bảo mật.
- **Trạng thái**: **PASS**
- **Ảnh chụp**: `docs/screenshots/TC-07.png`

### 8. TC-08 (Tính năng lọc danh sách - FR9) | Ưu tiên: Cao
- **Tiền điều kiện**: Đăng nhập giao diện web quản lý (`http://localhost:3000`), có dữ liệu phiếu trong ngày.
- **Bước thực hiện**: Truy cập tab "1. Danh Sách Phiếu" và tick chọn hộp kiểm **"Lọc phiếu trong ngày của tôi (FR9)"**.
- **Kết quả mong đợi**: Giao diện load lại và chỉ lọc hiển thị chính xác các phiếu do nhân viên hiện tại tiếp nhận trong ngày.
- **Kết quả thực tế**: Bảng danh sách lọc dữ liệu trực quan, chính xác theo đúng yêu cầu nghiệp vụ trên giao diện.
- **Trạng thái**: **PASS**
- **Ảnh chụp**: `docs/screenshots/TC-08.png`

### 9. TC-09 (Tái lập / Chống trùng lặp Idempotency qua Giao diện) | Ưu tiên: Cao
- **Tiền điều kiện**: Mở trang web CRM trên trình duyệt (`http://localhost:3000`).
- **Bước thực hiện**: Mở bảng DevTools (F12) -> tab **Console**, thực thi đoạn lệnh `fetch` gọi API tạo phiếu lặp lại 2 lần với cùng một `idempotencyKey` cố định.
- **Kết quả mong đợi**: Request đầu tiên xử lý thành công, request thứ hai được hệ thống nhận diện khóa trùng và chặn lại, không sinh bản ghi nhân đôi trong CSDL.
- **Kết quả thực tế**: Console hiển thị phản hồi chính xác của cả 2 lần gọi, cơ chế chống trùng lặp hoạt động chuẩn xác trên môi trường web thực tế.
- **Trạng thái**: **PASS**
- **Ảnh chụp**: `docs/screenshots/TC-09.png`

### 10. TC-10 (Tái lập / Quy trình Seed Data CSV) | Ưu tiên: Trung bình
- **Tiền điều kiện**: Mở Terminal trong thư mục dự án VS Code.
- **Bước thực hiện**: Chạy câu lệnh thực thi script nạp dữ liệu: `node import_csv.js`.
- **Kết quả mong đợi**: Script thực thi kết nối PostgreSQL, đọc file CSV và nạp thành công toàn bộ khách hàng, thiết bị, ticket và log trạng thái.
- **Kết quả thực tế**: Terminal thông báo nạp thành công toàn bộ dữ liệu mẫu không phát sinh lỗi.
- **Trạng thái**: **PASS**
- **Ảnh chụp**: `docs/screenshots/TC-10.png`