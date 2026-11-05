# Test Plan Luồng L2: Tiếp nhận thiết bị bảo hành (Track SE)

## 1. Phạm vi kiểm thử (Scope)
- **Phần CÓ kiểm thử (In-scope)**: 
  - Tiếp nhận phiếu bảo hành mới và sinh mã phiếu duy nhất (`FR3`).
  - Tự động xác định tình trạng bảo hành (Còn / Hết / Chưa xác minh) theo quy tắc nghiệp vụ `QT-05` dựa trên ngày mua và số tháng bảo hành.
  - Phân quyền dữ liệu theo trung tâm bảo hành (`QT-14`).
  - Cơ chế che số điện thoại bảo mật theo vai trò (`QT-15`).
  - Cơ chế chặn phiếu trùng lặp thông qua khóa định danh `idempotencyKey` và ràng buộc `QT-03`.
  - Tính năng lọc danh sách phiếu theo nhân viên trong ngày và quy trình nạp dữ liệu mẫu tự động từ CSV.
- **Phần CHỦ Ý KHÔNG kiểm thử (Out-of-scope)**: 
  - Màn hình cấu hình hệ thống (chỉ đọc dữ liệu tĩnh, không chứa quy tắc nghiệp vụ).
  - Kiểm thử hiệu năng, tải cao (Load Testing / Stress Testing) vì hạng mục này thuộc phạm vi học phần *Chuyên đề tốt nghiệp 2*.

## 2. Danh sách và phân loại Test Cases (Test Types & Distribution)
Hệ thống thực hiện kiểm thử tổng cộng **10 Test Cases (TC-01 đến TC-10)** bao gồm các tầng kiểm thử:
- **Kiểm thử giao diện & nghiệp vụ cơ bản (TC-01 đến TC-07)**: Kiểm tra hiển thị danh sách, tìm kiếm, tiếp nhận phiếu mới, xem chi tiết, phân quyền và lịch sử thiết bị.
- **Kiểm thử chức năng nâng cao & tích hợp (TC-08 đến TC-10)**: 
  - **TC-08**: Kiểm tra tính năng lọc danh sách phiếu bảo hành theo nhân viên trong ngày.
  - **TC-09**: Kiểm tra cơ chế chống trùng lặp (`Idempotency`) khi gửi request tạo phiếu.
  - **TC-10**: Kiểm tra quy trình nạp dữ liệu mẫu tự động từ file CSV (Seed Data / Migration).
- **Kỹ thuật chọn dữ liệu thử**: Sử dụng phương pháp *Phân vùng tương đương* (Equivalence Partitioning) và *Giá trị biên* (Boundary Value Analysis) cho các trường dữ liệu ngày tháng và mô tả lỗi.

## 3. Tiêu chí thành công đo được (Success Criteria)
- 10/10 test cases phải chạy và ghi nhận kết quả minh chứng hình ảnh thực tế đầy đủ.
- Toàn bộ các quy tắc nghiệp vụ cốt lõi (`QT-03`, `QT-05`, `QT-14`, `QT-15`) được kiểm chứng qua các test case tương ứng.
- Không còn bất kỳ bug mức độ *Critical* nào đang ở trạng thái mở.

## 4. Môi trường và dữ liệu thử (Environment & Test Data)
- **Môi trường thực thi**: Node.js v20+, PostgreSQL 15+.
- **Dữ liệu mẫu khởi tạo**: Sử dụng tập dữ liệu cố định từ thư mục `seeds/` và file dữ liệu CSV thực tế.
- **Cơ chế thiết lập/dọn dẹp dữ liệu**: Đảm bảo tính độc lập tuyệt đối cho từng test case khi thao tác trên môi trường `localhost:3000` và cơ sở dữ liệu PostgreSQL.